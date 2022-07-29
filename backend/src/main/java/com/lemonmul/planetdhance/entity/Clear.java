package com.lemonmul.planetdhance.entity;

import javax.persistence.*;

@Entity

public class Clear {
    @Column(columnDefinition = "INT UNSIGNED", name ="clear_id")
    @Id
    @GeneratedValue
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "music_id")
    private Music music;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;


}
