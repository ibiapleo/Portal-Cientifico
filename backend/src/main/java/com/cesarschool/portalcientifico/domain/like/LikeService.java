package com.cesarschool.portalcientifico.domain.like;

import com.cesarschool.portalcientifico.domain.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;

    @Transactional
    public boolean toggleLike(User user, TargetType targetType, Long targetId) {
        var existingLike = likeRepository.findByUserIdAndTarget(user.getId(), targetType, targetId);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return false;
        } else {
            Like newLike = Like.builder()
                    .user(user)
                    .targetType(targetType)
                    .targetId(targetId)
                    .createdAt(LocalDateTime.now())
                    .build();
            likeRepository.save(newLike);
            return true;
        }
    }

    public long countLikes(TargetType targetType, Long targetId) {
        return likeRepository.countByTarget(targetType, targetId);
    }

    public boolean isLikedByUser(User user, TargetType targetType, Long targetId) {
        return likeRepository.existsByUserIdAndTarget(user.getId(), targetType, targetId);
    }

    public Map<Long, Long> countLikesByTargetIds(TargetType type, List<Long> targetIds) {
        List<Like> likes = likeRepository.findByTargetTypeAndTargetIdIn(type, targetIds);

        return likes.stream()
                .collect(Collectors.groupingBy(Like::getTargetId, Collectors.counting()));
    }
}
