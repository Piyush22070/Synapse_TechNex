//
//  ContentView.swift
//  pred-mod
//

import SwiftUI

struct ContentView: View {
    @State private var showLanding = true
    @State private var selectedAMC: String?
    
    var body: some View {
        ZStack {
            if showLanding {
                LandingView(showLanding: $showLanding)
                    .transition(.opacity)
            } else if selectedAMC == nil {
                DashboardView(selectedAMC: $selectedAMC)
                    .transition(.opacity)
            } else {
                PredictionView(selectedAMC: $selectedAMC)
                    .transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.4), value: showLanding)
        .animation(.easeInOut(duration: 0.4), value: selectedAMC)
    }
}

// ======================
// LANDING SCREEN
// ======================
struct LandingView: View {
    @Binding var showLanding: Bool
    @State private var animate = false
    
    var body: some View {
        ZStack {
            Color.white.ignoresSafeArea()
            
            VStack(spacing: 30) {
                Spacer()
                
                VStack(spacing: 12) {
                    Text("ALPHA")
                        .font(.system(size: 56, weight: .black))
                        .foregroundColor(.black)
                        .scaleEffect(animate ? 1 : 0.8)
                        .opacity(animate ? 1 : 0)
                    
                    Text("ML-Powered Return Predictions")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(.black.opacity(0.6))
                        .opacity(animate ? 1 : 0)
                }
                
                Spacer()
                
                Button(action: {
                    showLanding = false
                }) {
                    HStack(spacing: 8) {
                        Text("Get Started")
                            .fontWeight(.semibold)
                        Image(systemName: "arrow.right")
                    }
                    .frame(maxWidth: 280)
                    .padding(.vertical, 16)
                    .background(Color.black)
                    .foregroundColor(.white)
                    .cornerRadius(14)
                }
                .opacity(animate ? 1 : 0)
                .padding(.bottom, 60)
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.8, dampingFraction: 0.8).delay(0.2)) {
                animate = true
            }
        }
    }
}

// ======================
// DASHBOARD VIEW
// ======================
struct DashboardView: View {
    @Binding var selectedAMC: String?
    @State private var searchText = ""
    
    let amcList = [
        AMCData(name: "Aditya Birla Sun Life Mutual Fund", funds: 49),
        AMCData(name: "Axis Mutual Fund", funds: 35),
        AMCData(name: "Bandhan Mutual Fund", funds: 2),
        AMCData(name: "Bank of India Mutual Fund", funds: 15),
        AMCData(name: "Baroda BNP Paribas Mutual Fund", funds: 24),
        AMCData(name: "Canara Robeco Mutual Fund", funds: 18),
        AMCData(name: "DSP Mutual Fund", funds: 35),
        AMCData(name: "Edelweiss Mutual Fund", funds: 20),
        AMCData(name: "Franklin Templeton Mutual Fund", funds: 26),
        AMCData(name: "HDFC Mutual Fund", funds: 38),
        AMCData(name: "HSBC Mutual Fund", funds: 35),
        AMCData(name: "ICICI Prudential Mutual Fund", funds: 57),
        AMCData(name: "IDBI Mutual Fund", funds: 18),
        AMCData(name: "IIFL Mutual Fund", funds: 3),
        AMCData(name: "ITI Mutual Fund", funds: 9),
        AMCData(name: "Indiabulls Mutual Fund", funds: 9),
        AMCData(name: "Invesco Mutual Fund", funds: 27),
        AMCData(name: "JM Financial Mutual Fund", funds: 11),
        AMCData(name: "Kotak Mahindra Mutual Fund", funds: 32),
        AMCData(name: "L&T Mutual Fund", funds: 2),
        AMCData(name: "LIC Mutual Fund", funds: 20),
        AMCData(name: "Mahindra Manulife Mutual Fund", funds: 14),
        AMCData(name: "Mirae Asset Mutual Fund", funds: 18),
        AMCData(name: "Motilal Oswal Mutual Fund", funds: 16),
        AMCData(name: "Nippon India Mutual Fund", funds: 45),
        AMCData(name: "PGIM India Mutual Fund", funds: 18),
        AMCData(name: "PPFAS Mutual Fund", funds: 2),
        AMCData(name: "Principal Mutual Fund", funds: 12),
        AMCData(name: "Quantum Mutual Fund", funds: 6),
        AMCData(name: "Quant Mutual Fund", funds: 15),
        AMCData(name: "SBI Mutual Fund", funds: 42),
        AMCData(name: "Sahara Mutual Fund", funds: 5),
        AMCData(name: "Sundaram Mutual Fund", funds: 22),
        AMCData(name: "Tata Mutual Fund", funds: 28),
        AMCData(name: "Taurus Mutual Fund", funds: 8),
        AMCData(name: "Trust Mutual Fund", funds: 3),
        AMCData(name: "UTI Mutual Fund", funds: 37),
        AMCData(name: "Union Mutual Fund", funds: 16),
        AMCData(name: "WhiteOak Capital Mutual Fund", funds: 3)
    ]
    
    var filteredAMCs: [AMCData] {
        if searchText.isEmpty {
            return amcList
        } else {
            return amcList.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
        }
    }
    
    var body: some View {
        ZStack {
            Color.white.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Header
                VStack(spacing: 16) {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("ALPHA")
                                .font(.system(size: 32, weight: .bold))
                                .foregroundColor(.black)
                            
                            Text("Select an AMC to predict returns")
                                .font(.subheadline)
                                .foregroundColor(.black.opacity(0.6))
                        }
                        
                        Spacer()
                        
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("\(amcList.count)")
                                .font(.system(size: 28, weight: .bold))
                                .foregroundColor(.black)
                            Text("Total AMCs")
                                .font(.caption)
                                .foregroundColor(.black.opacity(0.6))
                        }
                    }
                    
                    // Search Bar
                    HStack(spacing: 12) {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.black.opacity(0.4))
                        
                        TextField("Search AMC...", text: $searchText)
                            .foregroundColor(.black)
                            .font(.system(size: 15))
                        
                        if !searchText.isEmpty {
                            Button(action: { searchText = "" }) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(.black.opacity(0.3))
                            }
                        }
                    }
                    .padding(14)
                    .background(Color.black.opacity(0.05))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.black.opacity(0.1), lineWidth: 1)
                    )
                }
                .padding(.horizontal, 32)
                .padding(.top, 32)
                .padding(.bottom, 20)
                .background(Color.white)
                
                Divider().background(Color.black.opacity(0.1))
                
                // AMC Grid
                ScrollView(.vertical, showsIndicators: true) {
                    LazyVGrid(columns: [
                        GridItem(.flexible(), spacing: 16),
                        GridItem(.flexible(), spacing: 16),
                        GridItem(.flexible(), spacing: 16)
                    ], spacing: 16) {
                        ForEach(filteredAMCs) { amc in
                            AMCCard(amc: amc) {
                                selectedAMC = amc.name
                            }
                        }
                    }
                    .padding(32)
                }
            }
        }
    }
}

struct AMCData: Identifiable {
    let id = UUID()
    let name: String
    let funds: Int
}

struct AMCCard: View {
    let amc: AMCData
    let action: () -> Void
    @State private var isHovered = false
    
    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Image(systemName: "building.2.fill")
                        .font(.system(size: 24))
                        .foregroundColor(.black.opacity(0.7))
                    
                    Spacer()
                    
                    Image(systemName: "arrow.right")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.black)
                }
                
                Spacer()
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(amc.name)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.black)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                    
                    Text("\(amc.funds) Funds Available")
                        .font(.caption)
                        .foregroundColor(.black.opacity(0.5))
                }
            }
            .padding(20)
            .frame(height: 160)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.black.opacity(0.03))
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.black.opacity(isHovered ? 0.3 : 0.1), lineWidth: 1.5)
            )
            .shadow(color: Color.black.opacity(isHovered ? 0.08 : 0), radius: 12, x: 0, y: 4)
        }
        .buttonStyle(PlainButtonStyle())
        .onHover { hovering in
            withAnimation(.easeInOut(duration: 0.2)) {
                isHovered = hovering
            }
        }
    }
}

// ======================
// MODELS
// ======================

struct NAVData: Codable {
    let date: String
    let nav: String
}

struct FundMeta: Codable {
    let fund_house: String
    let scheme_type: String
    let scheme_category: String
    let scheme_code: Int
    let scheme_name: String
    
    enum CodingKeys: String, CodingKey {
        case fund_house
        case scheme_type
        case scheme_category
        case scheme_code
        case scheme_name
    }
}

struct FundPageItem: Codable {
    let meta: FundMeta
    let data: [NAVData]
}

struct MutualFund: Identifiable {
    let id = UUID()
    let meta: FundMeta
    let data: [NAVData] // Recent 180 days
}

// For search results
struct SchemeSummary: Codable {
    let schemeCode: Int
    let schemeName: String
}

// ======================
// PREDICTION VIEW - FIXED WITH SEARCH ENDPOINT
// ======================
struct PredictionView: View {
    @Binding var selectedAMC: String?
    
    // Input states...
    @State private var minSip = "5000"
    @State private var expenseRatio = "1.5"
    @State private var fundAge = "5"
    @State private var sharpe = "0.8"
    @State private var alpha = "2.0"
    @State private var riskLevel = "3"
    @State private var category = "Equity"
    @State private var subCategory = "FoFs Domestic"
    
    @State private var return1Y: Double?
    @State private var return3Y: Double?
    @State private var return5Y: Double?
    
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    @State private var funds: [MutualFund] = []
    @State private var isLoadingFunds = true
    @State private var fundError: String?
    
    var body: some View {
        ZStack {
            Color.white.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Header...
                HStack {
                    Button(action: {
                        selectedAMC = nil
                        return1Y = nil
                        return3Y = nil
                        return5Y = nil
                        funds = []
                    }) {
                        HStack(spacing: 8) {
                            Image(systemName: "chevron.left")
                            Text("Back to Dashboard")
                        }
                        .font(.system(size: 15, weight: .medium))
                        .foregroundColor(.black.opacity(0.7))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(Color.black.opacity(0.05))
                        .cornerRadius(10)
                    }
                    .buttonStyle(PlainButtonStyle())
                    
                    Spacer()
                }
                .padding(.horizontal, 32)
                .padding(.top, 24)
                .padding(.bottom, 16)
                
                Divider().background(Color.black.opacity(0.1))
                
                HStack(spacing: 0) {
                    // Left Panel
                    ScrollView(.vertical, showsIndicators: false) {
                        // ... (same as before)
                        VStack(alignment: .leading, spacing: 20) {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(selectedAMC ?? "")
                                    .font(.system(size: 28, weight: .bold))
                                    .foregroundColor(.black)
                                
                                Text("Enter fund details for ML prediction")
                                    .foregroundColor(.black.opacity(0.6))
                                    .font(.subheadline)
                            }
                            .padding(.bottom, 10)
                            
                            Divider().background(Color.black.opacity(0.2))
                            
                            VStack(alignment: .leading, spacing: 16) {
                                sectionHeader("Financial Metrics")
                                inputField("SIP AMOUNT (₹)", $minSip, icon: "indianrupeesign.circle")
                                inputField("Expense Ratio (%)", $expenseRatio, icon: "percent")
                                inputField("Fund Age (Years)", $fundAge, icon: "calendar")
                                inputField("Sharpe Ratio", $sharpe, icon: "chart.line.uptrend.xyaxis")
                                inputField("Alpha", $alpha, icon: "a.circle")
                                inputField("Risk Level", $riskLevel, icon: "exclamationmark.triangle")
                            }
                            
                            Divider().background(Color.black.opacity(0.2)).padding(.vertical, 8)
                            
                            VStack(alignment: .leading, spacing: 16) {
                                sectionHeader("Fund Details")
                                inputField("Category", $category, icon: "square.grid.2x2")
                                inputField("Sub Category", $subCategory, icon: "list.bullet")
                            }
                            
                            Button(action: predictReturns) {
                                HStack(spacing: 10) {
                                    if isLoading {
                                        ProgressView()
                                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                            .scaleEffect(0.9)
                                    }
                                    Text(isLoading ? "Analyzing..." : "Predict Returns")
                                        .fontWeight(.semibold)
                                        .font(.system(size: 16))
                                    Image(systemName: "brain.head.profile")
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 16)
                                .background(Color.black)
                                .foregroundColor(.white)
                                .cornerRadius(12)
                                .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
                            }
                            .disabled(isLoading)
                            .padding(.top, 12)
                            
                            if let error = errorMessage {
                                HStack(spacing: 8) {
                                    Image(systemName: "exclamationmark.circle.fill")
                                    Text(error)
                                        .font(.caption)
                                }
                                .foregroundColor(.red)
                                .padding(12)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.red.opacity(0.1))
                                .cornerRadius(8)
                            }
                            
                            Spacer(minLength: 20)
                        }
                        .padding(32)
                    }
                    .frame(width: 420)
                    
                    Divider().background(Color.black.opacity(0.15))
                    
                    // Right Panel
                    ScrollView {
                        // ... (same as before)
                        VStack(alignment: .leading, spacing: 32) {
                            // Predicted Returns section...
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Predicted Returns")
                                    .font(.system(size: 32, weight: .bold))
                                    .foregroundColor(.black)
                                
                                Text("AI-generated forecasts")
                                    .foregroundColor(.black.opacity(0.6))
                                    .font(.subheadline)
                            }
                            .padding(.top, 32)
                            
                            if let r1 = return1Y {
                                VStack(spacing: 18) {
                                    resultCard("1 Year Return", r1)
                                    resultCard("3 Year Return", return3Y)
                                    resultCard("5 Year Return", return5Y)
                                }
                            } else {
                                VStack(spacing: 16) {
                                    Image(systemName: "chart.bar.doc.horizontal")
                                        .font(.system(size: 60))
                                        .foregroundColor(.black.opacity(0.3))
                                    
                                    Text("No prediction yet")
                                        .font(.title3)
                                        .foregroundColor(.black.opacity(0.6))
                                    
                                    Text("Fill in the details and click predict")
                                        .font(.caption)
                                        .foregroundColor(.black.opacity(0.5))
                                }
                                .frame(maxWidth: .infinity, maxHeight: 200)
                            }
                            
                            Divider().background(Color.black.opacity(0.2))
                            
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Historical NAV Performance")
                                    .font(.system(size: 28, weight: .bold))
                                    .foregroundColor(.black)
                                
                                Text("NAV trends for funds under this AMC")
                                    .foregroundColor(.black.opacity(0.6))
                                    .font(.subheadline)
                            }
                            
                            if isLoadingFunds {
                                ProgressView("Loading funds...")
                                    .padding()
                                    .frame(maxWidth: .infinity)
                            } else if let error = fundError {
                                Text("Error: \(error)")
                                    .foregroundColor(.red)
                                    .padding()
                            } else if funds.isEmpty {
                                Text("No funds found for this AMC")
                                    .foregroundColor(.black.opacity(0.6))
                            } else {
                                ForEach(funds) { fund in
                                    FundNAVCard(fund: fund)
                                }
                            }
                            
                            Spacer()
                        }
                        .padding(.horizontal, 32)
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .onAppear {
            fetchFundsForAMC()
        }
    }
    
    // FIXED: Use /mf/search?q= endpoint
    func fetchFundsForAMC() {
        isLoadingFunds = true
        fundError = nil
        funds = []
        
        guard let amc = selectedAMC else { return }
        
        let searchTerm = amc.replacingOccurrences(of: " Mutual Fund", with: "").trimmingCharacters(in: .whitespaces)
        let encoded = searchTerm.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let urlString = "https://api.mfapi.in/mf/search?q=\(encoded)"
        
        guard let url = URL(string: urlString) else {
            fundError = "Invalid search URL"
            isLoadingFunds = false
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, _, error in
            DispatchQueue.main.async {
                if let error = error {
                    self.fundError = "Network error: \(error.localizedDescription)"
                    self.isLoadingFunds = false
                    return
                }
                
                guard let data = data else {
                    self.fundError = "No data received"
                    self.isLoadingFunds = false
                    return
                }
                
                do {
                    let summaries = try JSONDecoder().decode([SchemeSummary].self, from: data)
                    let limited = Array(summaries.prefix(12))
                    
                    var loaded: [MutualFund] = []
                    let group = DispatchGroup()
                    
                    for summary in limited {
                        group.enter()
                        fetchNAVHistory(for: summary.schemeCode) { fund in
                            if let fund = fund {
                                loaded.append(fund)
                            }
                            group.leave()
                        }
                    }
                    
                    group.notify(queue: .main) {
                        self.funds = loaded.sorted { $0.meta.scheme_name < $1.meta.scheme_name }
                        self.isLoadingFunds = false
                    }
                } catch {
                    self.fundError = "Failed to parse search results: \(error.localizedDescription)"
                    self.isLoadingFunds = false
                }
            }
        }.resume()
    }
    
    func fetchNAVHistory(for schemeCode: Int, completion: @escaping (MutualFund?) -> Void) {
        let urlString = "https://api.mfapi.in/mf/\(schemeCode)"
        guard let url = URL(string: urlString) else {
            completion(nil)
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, _, _ in
            guard let data = data,
                  let item = try? JSONDecoder().decode(FundPageItem.self, from: data) else {
                completion(nil)
                return
            }
            
            let limitedData = Array(item.data.prefix(180))
            let fund = MutualFund(meta: item.meta, data: limitedData)
            completion(fund)
        }.resume()
    }
    
    // ... (rest of UI helpers and predictReturns same as before)
    
    func sectionHeader(_ title: String) -> some View {
        Text(title)
            .font(.system(size: 14, weight: .semibold))
            .foregroundColor(.black.opacity(0.7))
            .textCase(.uppercase)
            .tracking(1.2)
    }
    
    func inputField(_ title: String, _ value: Binding<String>, icon: String) -> some View {
        // same as before
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(.black.opacity(0.6))
            
            HStack(spacing: 10) {
                Image(systemName: icon)
                    .foregroundColor(.black.opacity(0.4))
                    .font(.system(size: 16))
                
                TextField(title, text: value)
                    .foregroundColor(.black)
                    .font(.system(size: 15))
            }
            .padding(12)
            .background(Color.black.opacity(0.05))
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color.black.opacity(0.1), lineWidth: 1)
            )
        }
    }
    
    func resultCard(_ title: String, _ value: Double?) -> some View {
        // same as before
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text(title)
                    .foregroundColor(.black.opacity(0.6))
                    .font(.system(size: 14))
                
                Spacer()
                
                Image(systemName: "arrow.up.right")
                    .foregroundColor(.black)
                    .font(.system(size: 14, weight: .bold))
            }
            
            Text(String(format: "%.2f%%", value ?? 0))
                .font(.system(size: 42, weight: .bold))
                .foregroundColor(.black)
        }
        .padding(20)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.black.opacity(0.05))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.black.opacity(0.15), lineWidth: 1)
        )
    }
    
    func predictReturns() {
        // same as before
        isLoading = true
        errorMessage = nil
        
        guard let url = URL(string: "https://pred-mod-776087882401.europe-west1.run.app/predict") else {
            errorMessage = "Invalid API URL"
            isLoading = false
            return
        }
        
        let payload: [String: Any] = [
            "min_sip": Double(minSip) ?? 5000,
            "min_lumpsum": 10000,
            "expense_ratio": Double(expenseRatio) ?? 1.5,
            "fund_size_cr": 2000,
            "fund_age_yr": Double(fundAge) ?? 5,
            "sortino": 0.5,
            "alpha": Double(alpha) ?? 2.0,
            "sd": 10,
            "beta": 1,
            "sharpe": Double(sharpe) ?? 0.8,
            "risk_level": Int(riskLevel) ?? 3,
            "amc_name": selectedAMC ?? "",
            "rating": 4.5,
            "category": category,
            "sub_category": subCategory
        ]
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: payload)
        
        URLSession.shared.dataTask(with: request) { data, _, error in
            DispatchQueue.main.async {
                isLoading = false
                
                if let error = error {
                    errorMessage = error.localizedDescription
                    return
                }
                
                guard let data = data,
                      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                    errorMessage = "Invalid response"
                    return
                }
                
                return1Y = (json["returns_1yr"] as? NSNumber)?.doubleValue
                return3Y = (json["returns_3yr"] as? NSNumber)?.doubleValue
                return5Y = (json["returns_5yr"] as? NSNumber)?.doubleValue
            }
        }.resume()
    }
}

// Fund NAV Card & LineChartView remain the same
struct FundNAVCard: View {
    let fund: MutualFund
    
    private var navValues: [Double] {
        fund.data.compactMap { Double($0.nav) }
    }
    
    private var latestNAV: String { fund.data.first?.nav ?? "N/A" }
    private var latestDate: String { fund.data.first?.date ?? "N/A" }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(fund.meta.scheme_name)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.black)
                .lineLimit(2)
                .multilineTextAlignment(.leading)
            
            LineChartView(dataPoints: navValues)
                .frame(height: 180)
            
            HStack {
                Text(latestDate)
                    .font(.caption)
                    .foregroundColor(.black.opacity(0.6))
                Spacer()
                Text("₹\(latestNAV)")
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(.black)
            }
        }
        .padding(16)
        .background(Color.black.opacity(0.03))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.black.opacity(0.1), lineWidth: 1)
        )
    }
}

struct LineChartView: View {
    let dataPoints: [Double]
    
    var body: some View {
        GeometryReader { geometry in
            if dataPoints.count >= 2,
               let min = dataPoints.min(),
               let max = dataPoints.max(),
               max > min {
                
                let points = dataPoints.enumerated().map { index, value in
                    CGPoint(
                        x: CGFloat(index) / CGFloat(dataPoints.count - 1) * geometry.size.width,
                        y: (1 - (value - min) / (max - min)) * geometry.size.height
                    )
                }
                
                Path { path in
                    path.move(to: points[0])
                    for point in points.dropFirst() {
                        path.addLine(to: point)
                    }
                }
                .stroke(Color.black, style: StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round))
            } else {
                Text("No data")
                    .foregroundColor(.gray)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .padding(.vertical, 8)
    }
}

#Preview {
    ContentView()
}
