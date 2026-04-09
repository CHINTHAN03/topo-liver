package com.topoliver.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HepaticState {
    private double steatosis; // 0.0 - 1.0 (0=Normal, >0.5 NAFLD, >0.8 severe)
    private double inflammation; // 0.0 - 1.0
    private double fibrosis; // 0.0 - 1.0
    private double fib4Score; // FIB-4 index value
    private int qtcInterval; // ECG QTc in ms
}