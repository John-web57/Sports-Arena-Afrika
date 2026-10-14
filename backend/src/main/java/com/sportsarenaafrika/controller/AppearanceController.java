package com.sportsarenaafrika.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportsarenaafrika.model.PlatformSetting;
import com.sportsarenaafrika.repository.PlatformSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/settings/appearance")
@RequiredArgsConstructor
public class AppearanceController {
    private static final String SETTING_KEY = "website_appearance";
    private static final Pattern HEX_COLOR = Pattern.compile("^#[0-9a-fA-F]{6}$");
    private final PlatformSettingRepository settings;
    private final ObjectMapper objectMapper;

    @GetMapping
    public Map<String, Object> getAppearance() {
        return settings.findById(SETTING_KEY).map(setting -> {
            try {
                return objectMapper.readValue(setting.getValue(), new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException exception) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Website appearance settings are invalid");
            }
        }).orElseGet(this::defaults);
    }

    @PutMapping
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    public Map<String, Object> updateAppearance(@RequestBody Map<String, Object> appearance) {
        Object theme = appearance.get("theme");
        if (!("light".equals(theme) || "dark".equals(theme))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Theme must be light or dark");
        }
        for (String colorKey : List.of("primaryColor", "primaryDarkColor", "accentColor", "breakingColor", "backgroundColor", "textColor")) {
            Object color = appearance.get(colorKey);
            if (color != null && (!(color instanceof String value) || !HEX_COLOR.matcher(value).matches())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid color value for " + colorKey);
            }
        }
        Object sections = appearance.get("homepageSections");
        if (sections != null && (!(sections instanceof List<?> values) || values.size() > 50 || values.stream().anyMatch(value -> !(value instanceof String)))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Homepage sections must be a list of section names");
        }
        Object customBlocks = appearance.get("customHomepageBlocks");
        if (customBlocks != null && (!(customBlocks instanceof List<?> values) || values.size() > 50 || values.stream().anyMatch(value -> !(value instanceof Map<?, ?>)))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Custom homepage blocks must be a list of block definitions");
        }
        try {
            PlatformSetting setting = settings.findById(SETTING_KEY).orElseGet(PlatformSetting::new);
            setting.setKey(SETTING_KEY);
            setting.setValue(objectMapper.writeValueAsString(appearance));
            settings.save(setting);
            return appearance;
        } catch (JsonProcessingException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appearance settings could not be saved");
        }
    }

    private Map<String, Object> defaults() {
        return Map.ofEntries(
                Map.entry("theme", "dark"),
                Map.entry("layoutPreset", "news"),
                Map.entry("homepageSections", List.of("breaking", "hero", "latest", "kenya", "africa", "otherSports", "features", "interviews", "events", "categories", "transfers", "women", "videos", "community", "newsletter")),
                Map.entry("primaryColor", "#0B6E4F"),
                Map.entry("primaryDarkColor", "#064B38"),
                Map.entry("accentColor", "#F4B400"),
                Map.entry("breakingColor", "#D62828"),
                Map.entry("backgroundColor", "#101817"),
                Map.entry("textColor", "#F5F7F7"),
                Map.entry("stickyHeader", true),
                Map.entry("showSearch", true),
                Map.entry("showSocial", true),
                Map.entry("articleLayout", "standard"),
                Map.entry("showSidebar", true),
                Map.entry("headingFont", "Montserrat"),
                Map.entry("bodyFont", "Poppins"),
                Map.entry("navigationItems", List.of("Home", "Sports", "Africa", "Global", "News", "Features", "More"))
        );
    }
}
