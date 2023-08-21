package com.ocena.qlsc.common.config;

import com.ocena.qlsc.common.annotation.ApiShow;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OperationCustomizer operationCustomizer() {
        return (operation, handlerMethod) -> {
            if (handlerMethod.getMethodAnnotation(ApiShow.class) == null) {
                // Ẩn hoàn toàn các phương thức không có chú thích @ApiShow
                return null;
            }
            return operation;
        };
    }

    @Bean
    public OpenAPI baseOpenAPI(){
        return new OpenAPI().info(
                new Info().title("Doc API QLSC")
                        .version("1.0.0")
                        .description("Spring doc-ui"));
    }
}
