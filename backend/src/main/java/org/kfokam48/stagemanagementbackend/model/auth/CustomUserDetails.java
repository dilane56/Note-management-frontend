package org.kfokam48.stagemanagementbackend.model.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final String username;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        // Supposons que le compte n'expire jamais.
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Supposons que le compte n'est jamais verrouillé.
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Supposons que les informations d'identification n'expirent jamais.
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Supposons que le compte est toujours actif.
        return true;
    }
}