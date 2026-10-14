package com.sportsarenaafrika.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import java.net.URI;

@Configuration
@ConditionalOnProperty(prefix = "app.storage", name = "enabled", havingValue = "true")
public class R2StorageConfig {
    @Bean
    S3Client r2Client(@Value("${app.storage.r2-account-id:}") String accountId, @Value("${app.storage.access-key-id:}") String accessKey, @Value("${app.storage.secret-access-key:}") String secretKey) {
        return S3Client.builder().endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com")).region(Region.US_EAST_1).credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey))).build();
    }
}
