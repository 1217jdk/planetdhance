package com.lemonmul.planetdhance.api;

import com.lemonmul.planetdhance.dto.*;
import com.lemonmul.planetdhance.entity.Clear;
import com.lemonmul.planetdhance.entity.Music;
import com.lemonmul.planetdhance.entity.VideoTag;
import com.lemonmul.planetdhance.entity.tag.Tag;
import com.lemonmul.planetdhance.entity.tag.TagType;
import com.lemonmul.planetdhance.entity.user.User;
import com.lemonmul.planetdhance.entity.video.Video;
import com.lemonmul.planetdhance.entity.video.VideoScope;
import com.lemonmul.planetdhance.service.MusicService;
import com.lemonmul.planetdhance.service.TagService;
import com.lemonmul.planetdhance.service.UserService;
import com.lemonmul.planetdhance.service.VideoService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/tag")
public class TagApi {

    //TODO 태그 타입 확인해서 해당 타입 아니면 에러 반환
    private final TagService tagService;
    private final MusicService musicService;
    private final UserService userService;
    private final VideoService videoService;

    private static final int tagSize=15;
    private static final int videoSize=18;

    /**
     * 연관 검색어 리스트 반환 (검색 빈도순)
     *
     * 요청 파라미터 예시: /tag/list/{입력한 검색어}
     * 검색 빈도가 높은 검색어 순으로 정렬
     * size는 기본값 15
     */
    @GetMapping("/list/{searchStr}")
    public Slice<TagDto> searchTagList(@PathVariable String searchStr){
        Slice<Tag> tagList = tagService.findTagByNameContaining(searchStr,tagSize);
        return tagList.map(TagDto::new);
    }

    /**
     * 가수 태그의 곡 리스트,영상 리스트 반환 (hit&like순) - 가수 검색 페이지 진입
     *
     * 요청 파라미터 예시: /tag/{해시태그 아이디}/artist
     * 곡 리스트는 전체
     * 영상 리스트 size는 기본값 18
     */
    @GetMapping("/{tag_id}/artist")
    public ResponseEntity<?> musicsAndArtistVideos(@PathVariable Long tag_id){
        int page=0;

        try {
            Tag tag = tagService.findTagById(tag_id,page);
            List<Music> musicList = musicService.findArtistVideoList(tag.getName());
            Slice<Video> videoList = videoService.findHitLikeVideoListByMusicList(page, videoSize, musicList, VideoScope.PUBLIC);

            return new ResponseEntity<>(new MusicSearchResponse(musicList,"artist",videoList), HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 가수 태그의 영상 리스트 반환 (hit&like순) - 가수 검색 페이지 무한 스크롤
     *
     * 요청 파라미터 예시: /tag/{해시태그 아이디}/artist/{page 번호}
     * 영상 리스트 size는 기본값 18
     */
    @GetMapping("/{tag_id}/artist/{page}")
    public ResponseEntity<?> artistVideos(@PathVariable Long tag_id,@PathVariable int page){
        try {
            Tag tag = tagService.findTagById(tag_id,page);
            List<Music> musicList = musicService.findArtistVideoList(tag.getName());
            Slice<Video> videoList = videoService.findHitLikeVideoListByMusicList(page, videoSize, musicList, VideoScope.PUBLIC);

            return new ResponseEntity<>(new GridResponse("artist",videoList), HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 곡 태그의 곡 리스트,영상 리스트 반환 (hit&like순) - 곡 검색 페이지 진입
     *
     * 요청 파라미터 예시: /tag/{해시태그 아이디}/music
     * 곡 리스트는 전체
     * 영상 리스트 size는 기본값 18
     */
    @GetMapping("/{tag_id}/music")
    public ResponseEntity<?> musicsAndMusicVideos(@PathVariable Long tag_id){
        int page=0;

        try {
            Tag tag = tagService.findTagById(tag_id,page);
            List<Music> musicList = musicService.findTitleVideoList(tag.getName());
            Slice<Video> videoList = videoService.findHitLikeVideoListByMusicList(page, videoSize, musicList, VideoScope.PUBLIC);

            return new ResponseEntity<>(new MusicSearchResponse(musicList,"music",videoList), HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 곡 태그의 영상 리스트 반환 (hit&like순) - 곡 검색 페이지 무한 스크롤
     *
     * 요청 파라미터 예시: /tag/{해시태그 아이디}/music/{page 번호}
     * 영상 리스트 size는 기본값 18
     */
    @GetMapping("/{tag_id}/music/{page}")
    public ResponseEntity<?> musicVideos(@PathVariable Long tag_id, @PathVariable int page){

        try {
            Tag tag = tagService.findTagById(tag_id,page);
            List<Music> musicList = musicService.findTitleVideoList(tag.getName());
            Slice<Video> videoList = videoService.findHitLikeVideoListByMusicList(page, videoSize, musicList, VideoScope.PUBLIC);

            return new ResponseEntity<>(new GridResponse("music",videoList), HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 커스텀 태그의 영상 리스트 반환(hit&like순) -커스텀 검색 페이지 진입(0),무한 스크롤(1~)
     *
     * 요청 파라미터 예시: /tag/{해시태그 아이디}/custom/{page 번호}
     * 영상 리스트 size는 기본값 18
     * (custom 태그 말고 일반 태그도 가능)
     */
    @GetMapping("/{tag_id}/custom/{page}")
    public ResponseEntity<?> customVideos(@PathVariable Long tag_id,@PathVariable int page){
        try {
            Tag tag = tagService.findTagById(tag_id, page);
            Slice<Video> videoList = videoService.findHitLikeVideoListByVideoTagList(page, videoSize, tag.getVideoTags(), VideoScope.PUBLIC);

            return new ResponseEntity<>(new GridResponse("custom",videoList), HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 국가 태그의 영상 리스트 반환(hit&like순) -커스텀 검색 페이지 진입(0),무한 스크롤(1~)
     *
     * 요청 파라미터 예시: /tag/{해시태그 아이디}/nation/{page 번호}
     * 영상 리스트 size는 기본값 18
     */
    @GetMapping("/{tag_id}/nation/{page}")
    public ResponseEntity<?> nationVideos(@PathVariable Long tag_id,@PathVariable int page){
        try {
            Tag tag = tagService.findTagById(tag_id, page);
            Slice<Video> videoList = videoService.findHitLikeVideoListByVideoTagList(page, videoSize, tag.getVideoTags(), VideoScope.PUBLIC);

            return new ResponseEntity<>(new GridResponse("nation",videoList), HttpStatus.OK);
        }catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 유저 정보, 유저의 클리어 정보, 닉네임 태그의 영상 리스트 반환(hit&like순) - 닉네임 검색 페이지 진입
     *
     * 요청 파라미터 예시: /tag/{해시태그 아이디}/user
     * 영상 리스트 size는 기본값 18
     */
    @GetMapping("/{tag_id}/user")
    public UserSearchResponse userInfoAndUserVideos(@PathVariable Long tag_id){
        int page=0;
        Tag tag = tagService.findTagById(tag_id,0);
        User user = userService.findByNickname(tag.getName());
        List<Clear> clearList = user.getClears();
        Slice<Video> videoList=videoService.findNewestVideoListByUser(page, videoSize, user, VideoScope.PUBLIC);
        return new UserSearchResponse(user,clearList,videoList);
    }

    /**
     * 닉네임 태그의 영상 리스트 반환(hit&like순) - 닉네임 검색 페이지 무한 스크롤
     *
     * 요청 파라미터 예시: /tag/{해시태그 아이디}/user/{page 번호}
     * 영상 리스트 size는 기본값 18
     */
    @GetMapping("/{tag_id}/user/{page}")
    public GridResponse userVideos(@PathVariable Long tag_id,@PathVariable int page){
        Tag tag = tagService.findTagById(tag_id, page);
        User user = userService.findByNickname(tag.getName());
        Slice<Video> videoList=videoService.findNewestVideoListByUser(page, videoSize, user, VideoScope.PUBLIC);
        return new GridResponse("user",videoList);
    }

    @Data
    static class TagDto {
        private Long id;
        private String type;
        private TagType className;
        private String imgUrl;

        public TagDto(Tag tag) {
            id=tag.getId();
            type =tag.getName();
            className =tag.getType();
            if(tag.getImgUrl()==null){
                if(tag.getType().equals(TagType.CUSTOM)) {
                    //TODO 커스텀 태그 이미지 경로 넣기
                    imgUrl = "default custom tag img";
                }else if(tag.getType().equals(TagType.NICKNAME)){
                    //TODO 가수 태그 이미지 경로 넣기
                    imgUrl="default user tag img";
                }
            }else {
                imgUrl = tag.getImgUrl();
            }
        }
    }

    @Data
    static class MusicSearchResponse {
        private List<MusicDto> musicList;
        private String prevPage;
        private Slice<VideoDto> videoList;

        public MusicSearchResponse(List<Music> musicList, String prevPage,Slice<Video> videoList) {
            this.musicList = musicList.stream().map(MusicDto::new).collect(Collectors.toList());
            this.prevPage=prevPage;
            this.videoList = videoList.map(VideoDto::new);
        }
    }

    @Data
    static class MusicDto{
        private Long id;
        private String title;
        private String artist;
        private String imgUrl;

        public MusicDto(Music music) {
            id=music.getId();
            title=music.getTitle();
            artist=music.getArtist();
            imgUrl=music.getImgUrl();
        }
    }

    @Data
    static class VideoTagDto{
        private Long videoId;
        private String videoImgUrl;

        public VideoTagDto(VideoTag videoTag) {
            videoId=videoTag.getVideo().getId();
            videoImgUrl=videoTag.getVideo().getImgUrl();
        }
    }
}
