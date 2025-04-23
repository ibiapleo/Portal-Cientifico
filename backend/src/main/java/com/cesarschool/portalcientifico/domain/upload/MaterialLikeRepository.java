package com.cesarschool.portalcientifico.domain.upload;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaterialLikeRepository extends JpaRepository<MaterialLike, Long> {
    Optional<MaterialLike> findByMaterialIdAndUserId(Long materialId, String userId);
}
