/**
 * Home UI Renderer (Dashboard)
 */
const HomeView = {
    render: (stats, recentItems, user, analytics = {}) => {
        const userName = user ? user.email.split('@')[0] : "Admin";
        
        // --- Chart Helper (SVG Area Chart) ---
        const renderChart = (data) => {
            if (!data || !data.values || data.values.length === 0) return '<div class="text-center text-muted p-4">لا توجد بيانات</div>';
            
            const values = data.values;
            const labels = data.labels;
            const height = 300; // Increased height
            const width = 600;  // Reduced width for better mobile scaling aspect ratio
            const padding = 50; 
            const maxVal = Math.max(...values, 5); // Ensure min height
            
            // Calculate coords
            const points = values.map((val, idx) => {
                const x = padding + (idx / (values.length - 1)) * (width - padding * 2);
                const y = height - padding - ((val / maxVal) * (height - padding * 2));
                return { x, y, val, label: labels[idx] };
            });

            // Make Path
            let pathD = `M ${points[0].x} ${points[0].y}`;
            points.slice(1).forEach(p => pathD += ` L ${p.x} ${p.y}`);
            const fillD = `${pathD} L ${points[points.length-1].x} ${height} L ${points[0].x} ${height} Z`;

            return `
                <div style="width:100%; height:300px; position:relative; overflow:hidden;">
                    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%; height:100%;">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
                                <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0"/>
                            </linearGradient>
                        </defs>
                        
                        <!-- Grid Lines -->
                        ${[0, 0.25, 0.5, 0.75, 1].map(r => `
                            <line x1="${padding}" y1="${height - padding - (r * (height - padding*2))}" x2="${width - padding}" y2="${height - padding - (r * (height - padding*2))}" stroke="var(--border)" stroke-width="1" stroke-dasharray="5"/>
                        `).join('')}

                        <!-- Area Fill -->
                        <path d="${fillD}" fill="url(#chartGradient)" />

                        <!-- Line Stroke -->
                        <path d="${pathD}" fill="none" stroke="var(--primary)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />

                        <!-- Points -->
                        ${points.map(p => `
                            <circle cx="${p.x}" cy="${p.y}" r="6" fill="#fff" stroke="var(--primary)" stroke-width="3" />
                        `).join('')}

                        <!-- Values (Above Points) -->
                        ${points.map(p => `
                            <text x="${p.x}" y="${p.y - 15}" text-anchor="middle" font-size="16" font-weight="bold" fill="var(--text-main)">${p.val}</text>
                        `).join('')}

                        <!-- Date Labels (Bottom) -->
                        ${points.map(p => `
                            <text x="${p.x}" y="${height - 15}" text-anchor="middle" font-size="14" fill="var(--text-muted)">${p.label}</text>
                        `).join('')}
                    </svg>
                </div>
            `;
        };

        const topPlacesList = analytics.topPlaces && analytics.topPlaces.length > 0 ? `
            <table class="data-table table-compact mb-0">
                <tbody>
                    ${analytics.topPlaces.map(p => {
                        const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2' fill='%23f1f5f9' stroke='none'/%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                        const img = (p.images && p.images.length > 0) ? p.images[0] : PLACEHOLDER;
                        
                        return `
                        <tr>
                            <td style="width: 50px;">
                                <div style="width: 38px; height: 38px; border-radius: 8px; overflow: hidden; background: #f1f5f9; border: 1px solid var(--border);">
                                    <img src="${img}" class="table-img w-100 h-100" style="object-fit: cover;" alt="${p.name_ar}" onerror="this.src='${PLACEHOLDER}'">
                                </div>
                            </td>
                            <td>
                                <div class="fw-bold fs-14 text-dark truncate-1">${p.name_ar}</div>
                                <div class="text-muted fs-11">الأكثر زيارة</div>
                            </td>
                        </tr>
                        `; 
                    }).join('')}
                </tbody>
            </table>
        ` : '<div class="text-center text-muted p-4 fs-14">لا توجد بيانات حالياً</div>';

        return `
            <!-- Standard Page Header Card -->
            <div class="card mb-4">
                <div class="page-header mb-0 flex-between">
                    <div>
                        <h2 class="page-title">لوحة التحكم</h2>
                        <p class="text-muted">مرحباً ${userName}، إليك نظرة عامة على التطبيق</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button onclick="location.hash='#/events/add'" class="btn btn-primary d-flex align-items-center gap-2">
                            <i data-lucide="plus-circle" style="width: 16px;"></i> إضافة فعالية
                        </button>
                        <button onclick="location.hash='#/places/add'" class="btn btn-outline-primary d-flex align-items-center gap-2">
                            <i data-lucide="map-pin" style="width: 16px;"></i> إضافة مكان
                        </button>
                    </div>
                </div>
            </div>

            <!-- Main Stats Grid -->
            <div class="stats-grid-modern mb-4">
                <!-- Places Card -->
                <div class="stat-card-modern">
                    <div class="stat-header-modern">
                        <div class="stat-icon-wrapper-modern icon-primary">
                            <i data-lucide="map-pin"></i>
                        </div>
                        <span class="stat-trend-badge trend-up">
                            <i data-lucide="trending-up" style="width:12px;"></i> +12%
                        </span>
                    </div>
                    <div class="stat-body-modern">
                        <span class="stat-value-modern">${stats.totalPlaces}</span>
                        <span class="stat-label-modern">إجمالي الأماكن</span>
                    </div>
                </div>

                <!-- Categories Card -->
                <div class="stat-card-modern">
                    <div class="stat-header-modern">
                        <div class="stat-icon-wrapper-modern icon-success">
                            <i data-lucide="layers"></i>
                        </div>
                        <span class="stat-trend-badge trend-neutral">
                            <i data-lucide="minus" style="width:12px;"></i> 0%
                        </span>
                    </div>
                    <div class="stat-body-modern">
                        <span class="stat-value-modern">${stats.mainCategories}</span>
                        <span class="stat-label-modern">الأقسام النشطة</span>
                    </div>
                </div>

                <!-- Events Card -->
                <div class="stat-card-modern">
                    <div class="stat-header-modern">
                        <div class="stat-icon-wrapper-modern icon-warning">
                            <i data-lucide="calendar"></i>
                        </div>
                        <span class="stat-trend-badge trend-up">
                            <i data-lucide="trending-up" style="width:12px;"></i> +5%
                        </span>
                    </div>
                    <div class="stat-body-modern">
                        <span class="stat-value-modern">${analytics.counts ? analytics.counts.events : 0}</span>
                        <span class="stat-label-modern">الفعاليات</span>
                    </div>
                </div>

                <!-- Added Today Card -->
                <div class="stat-card-modern">
                    <div class="stat-header-modern">
                        <div class="stat-icon-wrapper-modern icon-info">
                            <i data-lucide="clock"></i>
                        </div>
                        <span class="stat-trend-badge trend-up">
                            <i data-lucide="plus" style="width:12px;"></i> جديد
                        </span>
                    </div>
                    <div class="stat-body-modern">
                        <span class="stat-value-modern">${stats.addedToday}</span>
                        <span class="stat-label-modern">أضيف اليوم</span>
                    </div>
                </div>
            </div>
            
            <div class="row g-4 mb-4">
                <!-- Analytics Chart -->
                <div class="col-lg-8">
                    <div class="card h-100">
                        <div class="card-header border-bottom">
                            <h3 class="card-title">إحصائيات المشاهدات (آخر 7 أيام)</h3>
                        </div>
                        <div class="card-body">
                            ${renderChart(analytics.chart)}
                        </div>
                    </div>
                </div>

                <!-- Top Places -->
                <div class="col-lg-4">
                    <div class="card h-100">
                        <div class="card-header border-bottom">
                            <h3 class="card-title">الأماكن الأكثر شعبية</h3>
                        </div>
                        <div class="card-body p-0">
                            ${topPlacesList}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="card">
                <div class="card-header border-bottom">
                    <h3 class="card-title">أحدث الإضافات</h3>
                </div>
                <div class="table-responsive">
                    <table class="data-table table-compact">
                        <thead>
                            <tr>
                                <th style="width: 50px;">الصورة</th>
                                <th>الاسم</th>
                                <th class="hide-mobile">القسم</th>
                                <th class="hide-mobile">تاريخ الإضافة</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${recentItems.length ? recentItems.map(i => {
                                const date = new Intl.DateTimeFormat('ar-EG', {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                }).format(new Date(i.created_at));
                                
                                // SVG Placeholder (Gray bg with Image icon)
                                const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2' fill='%23f1f5f9' stroke='none'/%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";

                                const img = (i.images && i.images.length > 0) ? i.images[0] : (i.main_image_url || PLACEHOLDER);
                                
                                return `
                                <tr>
                                    <td>
                                        <div style="width: 32px; height: 32px; border-radius: 6px; overflow: hidden; background: #f1f5f9; border: 1px solid var(--border);">
                                            <img src="${img}" class="table-img w-100 h-100" style="object-fit: cover;" alt="${i.name_ar}" onerror="this.src='${PLACEHOLDER}'">
                                        </div>
                                    </td>
                                    <td class="fw-bold fs-14">${i.name_ar}</td>
                                    <td class="hide-mobile">
                                        <span class="badge" style="background: var(--bg-body); color: var(--text-secondary); border: 1px solid var(--border); font-size: 11px;">
                                            ${i.category_name || 'غير محدد'}
                                        </span>
                                    </td>
                                    <td class="text-muted fs-12 hide-mobile">${date}</td>
                                </tr>
                                `;
                            }).join('') + `
                                <tr>
                                    <td colspan="4" class="text-center py-3 bg-light-soft">
                                        <a href="#/places" class="text-primary text-decoration-none fw-bold fs-14 hover-text-dark">
                                            عرض كل الأماكن <i data-lucide="arrow-left" style="width:14px; vertical-align:middle;"></i>
                                        </a>
                                    </td>
                                </tr>
                            ` : '<tr><td colspan="4" class="text-center py-5 text-muted">لا توجد إضافات حديثة</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
};

window.HomeView = HomeView;
