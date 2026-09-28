package com.military.assetmanagement.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/docs")
@Tag(name = "Documentation", description = "System Documentation and API Specifications")
public class DocController {

    @GetMapping
    @Operation(summary = "Get System API Documentation")
    public ResponseEntity<Map<String, Object>> getDocumentation() {
        Map<String, Object> doc = new HashMap<>();
        doc.put("system", "Military Asset Management System");
        doc.put("version", "1.0.0");
        doc.put("description", "Role-based logistics and inventory tracking system across military bases.");

        List<Map<String, String>> endpoints = Arrays.asList(
                createEndpoint("POST", "/api/auth/login", "/login", "PUBLIC", "Authenticate user credentials & return JWT bearer token"),
                createEndpoint("GET", "/api/dashboard", "/dashboard", "AUTHENTICATED", "Calculate Opening/Closing balances, Net Movement breakdown & stock metrics"),
                createEndpoint("GET", "/api/purchases", "/purchases", "AUTHENTICATED", "Get filtered purchase history table"),
                createEndpoint("POST", "/api/purchases", "/purchases", "ADMIN, LOGISTICS_OFFICER, BASE_COMMANDER", "Record new asset purchase per base & update stock"),
                createEndpoint("GET", "/api/transfers", "/transfers", "AUTHENTICATED", "Get inter-base transfer movement history timeline"),
                createEndpoint("POST", "/api/transfers", "/transfers", "ADMIN, LOGISTICS_OFFICER, BASE_COMMANDER", "Initiate transactional inter-base asset transfer (@Transactional)"),
                createEndpoint("GET", "/api/assignments", "/assignments-expenditures", "AUTHENTICATED", "Get personnel asset assignments history"),
                createEndpoint("POST", "/api/assignments", "/assignments-expenditures", "ADMIN, BASE_COMMANDER", "Assign equipment/asset to military personnel"),
                createEndpoint("PUT", "/api/assignments/{id}/return", "/assignments-expenditures", "ADMIN, BASE_COMMANDER", "Return assigned asset back to base stock"),
                createEndpoint("GET", "/api/expenditures", "/assignments-expenditures", "AUTHENTICATED", "Get operational expenditures (consumption) history"),
                createEndpoint("POST", "/api/expenditures", "/assignments-expenditures", "ADMIN, BASE_COMMANDER, LOGISTICS_OFFICER", "Record operational asset expenditure"),
                createEndpoint("GET", "/api/bases", "/dashboard", "AUTHENTICATED", "List all military bases for dropdown filtering & selection"),
                createEndpoint("GET", "/api/equipment-types", "/dashboard", "AUTHENTICATED", "List all equipment categories for dropdown filtering & selection"),
                createEndpoint("GET", "/api/assets", "/dashboard", "AUTHENTICATED", "List current stock balance levels per base & category"),
                createEndpoint("GET", "/api/health", "/docs", "PUBLIC", "Check live backend service health status (used for UptimeRobot monitoring)"),
                createEndpoint("GET", "/api/docs", "/docs", "PUBLIC", "Get system API documentation JSON")
        );

        doc.put("endpoints", endpoints);

        Map<String, String> rbac = new HashMap<>();
        rbac.put("ADMIN", "Full system access to all bases, operations, and audit logs");
        rbac.put("BASE_COMMANDER", "Access restricted to operations and inventory for assigned base");
        rbac.put("LOGISTICS_OFFICER", "Limited to purchases, inter-base transfers, and inventory viewing");
        doc.put("roles", rbac);

        return ResponseEntity.ok(doc);
    }

    private Map<String, String> createEndpoint(String method, String path, String frontendRoute, String role, String description) {
        Map<String, String> ep = new HashMap<>();
        ep.put("method", method);
        ep.put("path", path);
        ep.put("frontendRoute", frontendRoute);
        ep.put("role", role);
        ep.put("description", description);
        return ep;
    }
}
