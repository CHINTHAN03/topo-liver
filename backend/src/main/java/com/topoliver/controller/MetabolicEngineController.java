package com.topoliver.controller;

import com.topoliver.model.LabParameters;
import com.topoliver.service.MetabolicProcessorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metabolic")
public class MetabolicEngineController {

    private final MetabolicProcessorService metabolicProcessorService;

    public MetabolicEngineController(MetabolicProcessorService metabolicProcessorService) {
        this.metabolicProcessorService = metabolicProcessorService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<Void> submitLabParameters(@RequestBody LabParameters labParameters) {
        metabolicProcessorService.processLabParameters(labParameters);
        return ResponseEntity.ok().build();
    }
}