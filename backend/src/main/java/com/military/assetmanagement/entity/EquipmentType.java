package com.military.assetmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "equipment_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String category; // Vehicle, Weapon, Ammunition, Communication Equipment, Medical Equipment

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String unit; // Units, Rounds, Sets, Kits, Pieces
}
