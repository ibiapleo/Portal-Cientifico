package com.cesarschool.portalcientifico.domain.user.follow;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByUserIdAndTargetUserId(String userId, String targetUserId);

    void deleteByUserIdAndTargetUserId(String userId, String targetUserId);

}
