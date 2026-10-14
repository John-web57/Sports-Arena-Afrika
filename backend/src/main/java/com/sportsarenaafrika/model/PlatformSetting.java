package com.sportsarenaafrika.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "platform_settings")
@Getter
@Setter
@NoArgsConstructor
public class PlatformSetting {
    @Id
    @Column(name = "setting_key", length = 100)
    private String key;

    @Lob
    @Column(name = "setting_value", nullable = false, columnDefinition = "LONGTEXT")
    private String value;
}
