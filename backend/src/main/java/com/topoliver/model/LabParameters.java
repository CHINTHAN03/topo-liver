package com.topoliver.model;

import lombok.Data;

@Data
public class LabParameters {
    private int age; // years
    private double ast; // U/L
    private double alt; // U/L
    private double platelets; // 10^9/L
    private double glucose; // mg/dL
}