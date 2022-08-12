package com.lemonmul.planetdhance.service;

import com.lemonmul.planetdhance.dto.ChallengeRequest;
import com.lemonmul.planetdhance.dto.TagRequestDto;
import com.lemonmul.planetdhance.entity.Like;
import com.lemonmul.planetdhance.entity.Music;
import com.lemonmul.planetdhance.entity.VideoTag;
import com.lemonmul.planetdhance.entity.tag.Tag;
import com.lemonmul.planetdhance.entity.tag.TagType;
import com.lemonmul.planetdhance.entity.user.User;
import com.lemonmul.planetdhance.entity.video.Video;
import com.lemonmul.planetdhance.entity.video.VideoScope;
import com.lemonmul.planetdhance.repo.MusicRepo;
import com.lemonmul.planetdhance.repo.TagRepo;
import com.lemonmul.planetdhance.repo.UserRepo;
import com.lemonmul.planetdhance.repo.VideoRepo;
import com.lemonmul.planetdhance.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VideoService {

    private final VideoRepo videoRepo;
    private final UserRepo userRepo;
    private final MusicRepo musicRepo;
    private final TagRepo tagRepo;

    /**
     * 검색 조건: 곡 1건, 공개 여부
     * 정렬: 최신순
     */
    public Slice<Video> findNewestVideoList(int page, int size, Music music,VideoScope scope){
        Pageable pageable=PageRequest.of(page,size);
        return videoRepo.findByMusicAndScopeOrderByRegDateDesc(music,scope,pageable);
    }

    /**
     * 검색 조건: 곡 1건, 공개 여부
     * 정렬: 조회수&좋아요 가중치, 가중치 같으면 최신순
     */
    public Slice<Video> findHitLikeVideoList(int page,int size,Music music,VideoScope scope){
        Pageable pageable=PageRequest.of(page,size);
        return videoRepo.findByMusicAndScopeOrderByOrderWeightDescRegDateDesc(music,scope,pageable);
    }

    /**
     * 검색 조건: 곡 여러 건, 공개 여부
     * 정렬: 조회수&좋아요 가중치, 가중치 같으면 최신순
     */
    public Slice<Video> findHitLikeVideoListByMusicList(int page, int size, List<Music> musicList, VideoScope scope){
        Pageable pageable=PageRequest.of(page,size);
        return videoRepo.findByMusicInAndScopeOrderByOrderWeightDescRegDateDesc(musicList,scope,pageable);
    }

    /**
     * 검색 조건: videoTag 여러 건, 공개 여부
     * 정렬: 조회수&좋아요 가중치, 가중치 같으면 최신순
     */
    public Slice<Video> findHitLikeVideoListByVideoTagList(int page, int size, List<VideoTag> videoTagList,VideoScope scope){
        Pageable pageable=PageRequest.of(page,size);
        return videoRepo.findByVideoTagsInAndScopeOrderByOrderWeightDescRegDateDesc(videoTagList,scope,pageable);
    }

    /**
     * 검색 조건: 공개 여부
     * 정렬: 조회수&좋아요 가중치, 가중치 같으면 최신순
     */
    public Slice<Video> findMainPageVideoList(int page,int size,VideoScope scope){
        Pageable pageable=PageRequest.of(page,size);
        return videoRepo.findMainByScopeOrderByOrderWeightDescRegDateDesc(scope,pageable);
    }

    /**
     * 검색 조건: 없음
     * 정렬: 없음(랜덤)
     */
    public List<Video> findRandomVideoInfoList(int size){
        return videoRepo.findRandom(size);
    }

    /**
     * 검색 조건: 좋아요 한 영상
     * 정렬: 최신순
     */
    public Slice<Video> findLikeVideoList(int page, int size, List<Like> likeList){
        Pageable pageable=PageRequest.of(page,size);
        return videoRepo.findByLikesInOrderByRegDateDesc(likeList,pageable);
    }

    /**
     * 검색 조건: 유저 한 명, 공개 여부
     * 정렬: 최신순
     */
    public Slice<Video> findNewestVideoListByUser(int page, int size, User user,VideoScope scope){
        Pageable pageable=PageRequest.of(page,size);
        return videoRepo.findByUserAndScopeOrderByRegDateDesc(user,scope,pageable);
    }

    /**
     * 검색 조건: 유저 한 명
     * 정렬: 최신순
     * TODO 공개 여부 조건 거는 부분 개선해서 함수 하나로 합치기
     */
    public Slice<Video> findAllNewestVideoListByUser(int page, int size, User user){
        Pageable pageable=PageRequest.of(page,size);
        return videoRepo.findByUserOrderByRegDateDesc(user,pageable);
    }

    /**
     *
     */
    @Transactional
    public boolean uploadChallengeVideo(MultipartFile videoFile, MultipartFile imgFile,
                                        ChallengeRequest challengeRequest) throws IOException {
        if(videoFile.isEmpty() || imgFile.isEmpty()){
            //TODO 예외처리
            return false;
        }

        String videoUrl = FileUtil.createFile(videoFile, "video" + File.separator + "article");
        String imgUrl=FileUtil.createFile(imgFile,"video"+File.separator+"img");
        VideoScope scope=challengeRequest.getScope();
        Optional<User> optionalUser=userRepo.findById(challengeRequest.getUserId());
        Optional<Music> optionalMusic = musicRepo.findById(challengeRequest.getMusicId());
        if(optionalUser.isEmpty() || optionalMusic.isEmpty()){
            //TODO 예외처리
            return false;
        }
        User user=optionalUser.get();
        Music music=optionalMusic.get();

        List<Tag> tagList = new ArrayList<>();
        //고정 태그들 추가
        tagList.add(tagRepo.findByNameAndType(user.getNickname(), TagType.NICKNAME));
        tagList.add(tagRepo.findByNameAndType(user.getNation().getName(), TagType.NATION));
        tagList.add(tagRepo.findByNameAndType(music.getTitle(), TagType.TITLE));
        tagList.add(tagRepo.findByNameAndType(music.getArtist(), TagType.ARTIST));
        //커스텀 태그들 추가
        for (TagRequestDto tagRequestDto : challengeRequest.getTagList()) {
            Tag tag=null;
            //이미 등록된 커스텀 태그인지 확인
            if(tagRepo.findCustomByNameAndType(tagRequestDto.getType(),TagType.CUSTOM).isEmpty()){
                tag=Tag.createCustomTag(tagRequestDto);
                tagRepo.save(tag);
            }
            tagList.add(tag);
        }

        Video video = Video.createVideo(videoUrl, imgUrl, scope, user, music);
        //video_tag 테이블에 태그들 추가
        for (Tag tag : tagList) {
            VideoTag.createVideoTag(video,tag);
        }

        videoRepo.save(video);

        return true;
    }
}
