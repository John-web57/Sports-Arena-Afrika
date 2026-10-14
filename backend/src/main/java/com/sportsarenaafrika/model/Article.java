package com.sportsarenaafrika.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Article {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, length=255) private String title;
    @Column(nullable=false, unique=true, length=255) private String slug;
    @Column(columnDefinition="TEXT") private String summary;
    @Lob @Column(nullable=false, columnDefinition="LONGTEXT") private String content;
    @Column(name="featured_image", length=500) private String featuredImage;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="category_id", nullable=false) private Category category;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="author_id", nullable=false) private User author;
    @Column(name="is_breaking") @Builder.Default private Boolean isBreaking=false;
    @Column(name="is_top_news") @Builder.Default private Boolean isTopNews=false;
    @Column(name="views_count") @Builder.Default private Long viewsCount=0L;
    @Column(name="reading_time") @Builder.Default private Integer readingTime=3;
    @Column(name="meta_title", length=255) private String metaTitle;
    @Column(name="meta_description", columnDefinition="TEXT") private String metaDescription;
    @Column(length=20) @Builder.Default private String status="DRAFT";
    @Column(name="edited_by", length=150) private String editedBy;
    @Column(name="published_at") private LocalDateTime publishedAt;
    @CreationTimestamp @Column(name="created_at", updatable=false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name="updated_at") private LocalDateTime updatedAt;
}
