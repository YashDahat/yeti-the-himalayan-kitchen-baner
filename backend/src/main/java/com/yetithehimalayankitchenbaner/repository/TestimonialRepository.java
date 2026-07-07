package com.yetithehimalayankitchenbaner.repository;

import com.yetithehimalayankitchenbaner.model.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TestimonialRepository extends JpaRepository<Testimonial, UUID> {
    List<Testimonial> findByApproved(boolean approved);
}