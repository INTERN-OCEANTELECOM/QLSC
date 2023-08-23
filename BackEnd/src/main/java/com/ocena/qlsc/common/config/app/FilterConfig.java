package com.ocena.qlsc.common.config.app;


import com.ocena.qlsc.common.util.ApiResources;
import com.ocena.qlsc.common.util.SystemUtils;
import com.ocena.qlsc.user.repository.RoleRepository;
import com.ocena.qlsc.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;
import java.io.IOException;
import java.util.List;

import com.ocena.qlsc.user.model.Role;


@Component
@WebFilter(urlPatterns = "/")
public class FilterConfig extends GenericFilterBean {
    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        //Swagger
        if (((HttpServletRequest) request).getRequestURI().contains("swagger")
                || ((HttpServletRequest) request).getRequestURI().contains("/v3/api-docs")){
            chain.doFilter(request, response);
            return;
        };

        if (httpRequest.getMethod().equalsIgnoreCase("OPTIONS")) {
            chain.doFilter(request, response);
        } else {
            setCorsHeaders(httpRequest, httpResponse);
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            List<Role> roles = getUserRole();
            boolean isRemove = validateUser();

            String path = httpRequest.getRequestURI();
            String method = httpRequest.getMethod();

            if (!validateRequest(path, method , roles)){
                chain.doFilter(request, response);
                return;
            }

            if(roles.isEmpty() || isRemove){
                httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
                return;
            }

            for (Role role : roles) {
                if (path.equals("/user/delete")
                        || path.equals("/user/add")
                        || path.equals("/user/get-all")
                        || path.equals("/role/get-all")){
                    if (!"ROLE_ADMIN".equals(role.getRoleName())) {
                        httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
                        return;
                    }
                } else if (path.startsWith("/user")
                        || path.startsWith("/po-detail")
                        || path.startsWith("/po")
                        || path.startsWith("/product")
                        || path.startsWith("/repair-history")
                        || path.startsWith("/history")) {
                    if (("ROLE_USER".equals(role.getRoleName())
                            ||("ROLE_QLSC".equals(role.getRoleName()) && !(path.startsWith("/repair-history")))
                            || ("ROLE_KCSANALYST".equals(role.getRoleName()) && !path.startsWith("/kcs-history"))
                            || ("ROLE_QLPO".equals(role.getRoleName()) && (path.startsWith("/repair-history") || path.startsWith("/history"))))){
                        httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
                        return;
                    }
                }
            }
            chain.doFilter(request, response);
        }
    }

    private void setCorsHeaders(HttpServletRequest request, HttpServletResponse response) {
        String origin = request.getHeader("Origin");
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT");
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, email");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }


    private List<Role> getUserRole() {
        String email = SystemUtils.getCurrentEmail();
        return roleRepository.getRoleByEmail(email);
    }

    private Boolean validateUser(){
        String email = SystemUtils.getCurrentEmail();
        return userRepository.existsByEmailAndRemoved(email, true);
    }

    private Boolean validateRequest(String path, String method, List<Role> roles){
        if (path.contains("/forgot-password/sent-otp")
                || path.contains("/forgot-password/verify")
                || path.equals("/user/login")){
            return false;
        }

        if ((!roles.isEmpty()) && !validateUser()){
            if (method.equals("GET")
                || path.contains(ApiResources.SEARCH_BY_KEYWORD)
                || path.contains("/repair-history/search-by-list-keywords")
                || path.contains("/user/reset-password")
                || path.contains("/user/update")){
                    if (path.equals("/user/get-all")
                            || path.equals("/role/get-all")
                            || path.equals("/history/get-all")
                            || path.equals("/history/get-by-created")) {
                        return true;
                    }
                    return false;
                }
        }
        return true;
    }
}