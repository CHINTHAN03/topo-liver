package com.topoliver.service;

import com.topoliver.model.HepaticState;
import com.topoliver.model.LabParameters;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class MetabolicProcessorService {

    private final SimpMessagingTemplate messagingTemplate;

    public MetabolicProcessorService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void processLabParameters(LabParameters params) {
        double steatosis = calculateSteatosis(params.getGlucose(), params.getAst(), params.getAlt());
        double inflammation = calculateInflammation(params.getAst(), params.getAlt());
        double fib4 = calculateFib4(params.getAge(), params.getAst(), params.getAlt(), params.getPlatelets());
        double fibrosis = calculateFibrosis(fib4);
        int qtc = calculateQtc(fib4);

        HepaticState state = new HepaticState(steatosis, inflammation, fibrosis, fib4, qtc);
        messagingTemplate.convertAndSend("/topic/liver-status", state);
    }

    private double calculateSteatosis(double glucose, double ast, double alt) {
        double glucoseFactor = Math.max(0.0, Math.min(1.0, (glucose - 90.0) / 100.0));
        double altFactor = Math.max(0.0, Math.min(1.0, (alt - 25.0) / 75.0));
        return Math.max(0.0, Math.min(1.0, (glucoseFactor * 0.5) + (altFactor * 0.5)));
    }

    private double calculateInflammation(double ast, double alt) {
        double maxEnzyme = Math.max(ast, alt);
        return Math.max(0.0, Math.min(1.0, (maxEnzyme - 30.0) / 150.0));
    }

    private double calculateFib4(int age, double ast, double alt, double platelets) {
        if (platelets <= 0 || alt <= 0) return 0.0;
        return (age * ast) / (platelets * Math.sqrt(alt));
    }

    private double calculateFibrosis(double fib4) {
        if (fib4 < 1.30) {
            return fib4 / 2.60;
        } else if (fib4 <= 2.67) {
            return 0.5 + ((fib4 - 1.30) / 1.37) * 0.3;
        } else {
            return Math.min(1.0, 0.8 + ((fib4 - 2.67) / 2.33) * 0.2);
        }
    }

    private int calculateQtc(double fib4) {
        int baseQtc = 420;
        if (fib4 > 2.67) {
            baseQtc += (int) (40 + Math.min(60, (fib4 - 2.67) * 20));
        } else if (fib4 > 1.30) {
            baseQtc += (int) (10 + (fib4 - 1.30) * 15);
        }
        return baseQtc;
    }
}