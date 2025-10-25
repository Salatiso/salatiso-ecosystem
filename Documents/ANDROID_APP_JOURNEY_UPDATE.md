# Android App Updates - Human-Centered Narrative
**Date:** October 14, 2025  
**Version:** Post-Journey Page Alignment  
**Purpose:** Sync Android app journey/about content with web app narrative (65% human, 35% professional)

---

## 🎯 Overview

The web app journey page has been completely rewritten to match the bridge site narrative. The Android app needs the same updates to maintain consistency across all platforms.

**Core Message:**
> "This is not about credentials or corporate achievements. It's about lived experience becoming useful knowledge. It's about a rural boy learning in formal systems, then bringing those skills back home to empower the next generation."

---

## ✅ Web App Updates Completed (October 14, 2025)

### 1. Journey Page Rewrite (`src/pages/journey.tsx`)
- ✅ Changed from professional timeline to **human-centered narrative**
- ✅ Hero section: "From Rural Roots to Living Ecosystem"
- ✅ Timeline corrected: **1982-2003** (birth year 1982)
- ✅ Five chapters:
  1. **1982-2003:** Born in Transkei - Mlandeli & Notemba's Son
  2. **2003-2012:** From Rural Boy to Safety Leader (OHS + law dropout)
  3. **2013-2022:** Boardrooms & Children's Courts (corporate + legal battles)
  4. **2023:** 15+ Books - All Free & Open
  5. **2023-Present:** MNI Ecosystem (named for parents)

### 2. Stats Updated
- ✅ Changed from professional metrics to human metrics:
  - Years of Living Experience: **43**
  - Books Published (All Free): **15+**
  - Years as Father: **15+**
  - Ecosystem Platforms: **9**

### 3. Ubuntu Section Enhanced
- ✅ Quote: "I am a father to my son; all else is a means to this end"
- ✅ Extended family as safety net (not formal systems)
- ✅ Impact over income (all books free, personal use free forever)

### 4. Books Section Added
- ✅ Links to Google Play books
- ✅ Link to YouTube audiobooks
- ✅ Emphasis: "Journey from lived experience to ecosystem was crystallised in books"

---

## 📱 Android App Files to Update

### Priority 1: Journey/About Section

#### **File:** `app/src/main/res/layout/fragment_journey.xml` or `AboutFragment.kt`
**Current Status:** Likely shows professional timeline  
**Required Changes:**
1. Update timeline to 5 chapters (1982-2003, 2003-2012, 2013-2022, 2023, 2023-Present)
2. Change hero text to match web app
3. Add Ubuntu philosophy section
4. Update stats to human metrics

#### **File:** `app/src/main/java/.../JourneyViewModel.kt` (or similar)
**Required Changes:**
```kotlin
data class TimelineEvent(
    val id: String,
    val year: String,
    val title: String,
    val description: String,
    val category: String,
    val achievements: List<String>
)

val timelineEvents = listOf(
    TimelineEvent(
        id = "transkei-roots",
        year = "1982-2003",
        title = "Born in Transkei - Mlandeli & Notemba's Son",
        description = "Born in 1982 to parents who modeled entrepreneurship and Ubuntu. Grew up in villages—Mahasana, Lenane, Kiriyatswana—where my father walked barefoot to school, where storytelling by firelight was education, where extended family was your safety net.",
        category = "foundation",
        achievements = listOf(
            "Ubuntu values embedded from childhood",
            "Xhosa heritage and cultural identity formed",
            "Extended family as primary safety net and education system"
        )
    ),
    TimelineEvent(
        id = "independence-ohs-career",
        year = "2003-2012",
        title = "From Rural Boy to Safety Leader",
        description = "At 18, independent. At 21, providing for myself. Junior Environmental Health Practitioner (EC Dept of Health), Best Trainee at Anglo Platinum (2004), OHS leadership at Metrorail, Liberty Group, 5G. Studied law briefly—aspired to justice, dropped out when I saw the corruption.",
        category = "growth",
        achievements = listOf(
            "Awarded \"Best Trainee\" at Anglo Platinum (2004)",
            "Law studies: conscious rejection of corrupt judiciary",
            "OHS career as means to serve, not define self"
        )
    ),
    TimelineEvent(
        id = "corporate-legal-battles",
        year = "2013-2022",
        title = "Boardrooms & Children's Courts",
        description = "Guided enterprise risk for Telkom/Gyro, advised corporate boards on resilience. But the real fight was personal: Children's Court battles exposed systemic gender bias against fathers. My son's rights became my mission—everything else was just a means to this end.",
        category = "expansion",
        achievements = listOf(
            "Corporate risk management for national brands",
            "Children's Court: exposed systemic gender bias",
            "Father's mission: \"I am a father to my son; all else is a means to this end\""
        )
    ),
    TimelineEvent(
        id = "books-publishing",
        year = "2023",
        title = "15+ Books - All Free & Open",
        description = "\"Goliath's Reckoning\" exposed gender bias in courts. \"The Homeschooling Father\" shared what I learned taking control of my son's education. \"Beyond Redress\" challenged race-based policies. \"Safety First\" series opened OHS careers to everyone—no tertiary qualification required.",
        category = "milestone",
        achievements = listOf(
            "15+ books published, all free and open access",
            "Legal reform advocacy through Goliath's Reckoning & Beyond Redress",
            "Homeschooling resources for father-led education",
            "OHS career guides accessible to all (no degree required)"
        )
    ),
    TimelineEvent(
        id = "mni-ecosystem",
        year = "2023-Present",
        title = "Mlandeli-Notemba Investments (MNI) Ecosystem",
        description = "Named for my parents. Built to solve real problems: Sonny Network (safety I wish I had), Piggyback (ride-sharing & parcel delivery for rural areas), LifeSync (homeschooling + family governance), DocuHelp, BizHelp, Flamea (legal advocacy). Tech learned in boardrooms, returned to serve the roots.",
        category = "innovation",
        achievements = listOf(
            "Named ecosystem after parents: Mlandeli-Notemba Investments",
            "Sonny Network: safety system for families and communities",
            "Piggyback: rural ride-sharing & parcel delivery",
            "LifeSync: homeschooling + family governance platform",
            "All platforms: personal use free forever"
        )
    )
)
```

---

### Priority 2: Stats/About Section

#### **File:** `app/src/main/java/.../StatsRepository.kt` or similar
**Current Stats (to replace):**
- Years of Professional Practice: 20+
- Books & Longform Works: 8+
- Advocacy & Community Projects: 3
- Apps & Tools in Development: 9

**New Stats (human-focused):**
```kotlin
data class Stat(
    val label: String,
    val value: String,
    val icon: Int // drawable resource ID
)

val humanStats = listOf(
    Stat("Years of Living Experience", "43", R.drawable.ic_calendar),
    Stat("Books Published (All Free)", "15+", R.drawable.ic_book),
    Stat("Years as Father", "15+", R.drawable.ic_heart),
    Stat("Ecosystem Platforms", "9", R.drawable.ic_lightbulb)
)
```

---

### Priority 3: Ubuntu Philosophy Section

#### **File:** `fragment_about.xml` or `AboutFragment.kt`
**Add New Section:**
```xml
<TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="Ubuntu: 'I Am Because We Are'"
    android:textSize="24sp"
    android:textStyle="bold"
    android:paddingBottom="16dp"/>

<TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="This ancient African philosophy guides every decision, every product, and every interaction in our ecosystem. Ubuntu teaches us that our humanity is bound up in the humanity of others. My father's barefoot journey to school is part of my story. My son's access to tools I didn't have is part of the next chapter."
    android:textSize="16sp"
    android:paddingBottom="24dp"/>

<!-- Ubuntu Values Grid -->
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="16dp"
    android:background="@drawable/rounded_background">
    
    <!-- Family First -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical"
        android:paddingBottom="16dp">
        
        <ImageView
            android:layout_width="48dp"
            android:layout_height="48dp"
            android:src="@drawable/ic_heart"
            android:tint="@color/primary"/>
        
        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical"
            android:paddingStart="16dp">
            
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Family First"
                android:textStyle="bold"
                android:textSize="18sp"/>
            
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="&quot;I am a father to my son; all else is a means to this end&quot;"
                android:textSize="14sp"
                android:textColor="@color/text_secondary"/>
        </LinearLayout>
    </LinearLayout>
    
    <!-- Community Strength -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical"
        android:paddingBottom="16dp">
        
        <ImageView
            android:layout_width="48dp"
            android:layout_height="48dp"
            android:src="@drawable/ic_users"
            android:tint="@color/primary"/>
        
        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical"
            android:paddingStart="16dp">
            
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Community Strength"
                android:textStyle="bold"
                android:textSize="18sp"/>
            
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Extended family as safety net, not formal systems"
                android:textSize="14sp"
                android:textColor="@color/text_secondary"/>
        </LinearLayout>
    </LinearLayout>
    
    <!-- Impact Over Income -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical">
        
        <ImageView
            android:layout_width="48dp"
            android:layout_height="48dp"
            android:src="@drawable/ic_target"
            android:tint="@color/primary"/>
        
        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical"
            android:paddingStart="16dp">
            
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Impact Over Income"
                android:textStyle="bold"
                android:textSize="18sp"/>
            
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="All books free, personal use free forever"
                android:textSize="14sp"
                android:textColor="@color/text_secondary"/>
        </LinearLayout>
    </LinearLayout>
</LinearLayout>
```

---

### Priority 4: Hero/Splash Screen Text

#### **File:** `activity_main.xml` or `HomeFragment.kt`
**Current Text (to replace):**
> "Trace the path from Salatiso.com's solo voice to Mlandeni Notemba Investments..."

**New Text:**
```xml
<TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="From Rural Roots to Living Ecosystem"
    android:textSize="32sp"
    android:textStyle="bold"
    android:gravity="center"
    android:paddingBottom="16dp"/>

<TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="My story does not begin with websites or code. It begins in the rural Transkei, immersed in Xhosa culture, raised in the strength of extended family and informal systems. My father once walked to school barefoot; I have never been without shoes. That is progress — and it is the foundation of everything I build."
    android:textSize="18sp"
    android:gravity="center"
    android:paddingHorizontal="24dp"/>
```

---

### Priority 5: Books Section

#### **File:** `fragment_books.xml` or `BooksFragment.kt`
**Add Section Above Book List:**
```xml
<TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="15+ Books - All Free &amp; Open"
    android:textSize="28sp"
    android:textStyle="bold"
    android:gravity="center"
    android:paddingBottom="16dp"/>

<TextView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="The journey from lived experience to ecosystem was crystallised in books. Each title documents not only professional expertise but also the personal battles, cultural heritage, and family values that shaped the vision."
    android:textSize="16sp"
    android:gravity="center"
    android:paddingHorizontal="24dp"
    android:paddingBottom="24dp"/>

<!-- Add Buttons -->
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:paddingHorizontal="24dp"
    android:paddingBottom="24dp">
    
    <Button
        android:id="@+id/btnGooglePlayBooks"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="View All Books on Google Play"
        android:backgroundTint="@color/primary"
        android:layout_marginBottom="12dp"/>
    
    <Button
        android:id="@+id/btnYouTubeAudiobooks"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Free Audiobooks on YouTube"
        style="@style/Widget.MaterialComponents.Button.OutlinedButton"/>
</LinearLayout>
```

**Add Click Listeners in Fragment/Activity:**
```kotlin
binding.btnGooglePlayBooks.setOnClickListener {
    val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/search?q=salatiso&c=books&hl=en"))
    startActivity(intent)
}

binding.btnYouTubeAudiobooks.setOnClickListener {
    val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.youtube.com/@Salatiso"))
    startActivity(intent)
}
```

---

## 🎨 String Resources Updates

### **File:** `app/src/main/res/values/strings.xml`

```xml
<!-- Journey/About Strings -->
<string name="journey_hero_title">From Rural Roots to\nLiving Ecosystem</string>
<string name="journey_hero_description">My story does not begin with websites or code. It begins in the rural Transkei, immersed in Xhosa culture, raised in the strength of extended family and informal systems. My father once walked to school barefoot; I have never been without shoes. That is progress — and it is the foundation of everything I build.</string>

<string name="journey_quote">"My father walked to school barefoot. I've never been without shoes. That's progress. Now my son has tools I wish existed—safety networks, homeschooling resources, platforms that respect family sovereignty. The cycle continues, but we're building the infrastructure our communities deserve."</string>

<string name="journey_closing">This ecosystem isn\'t about credentials or corporate achievements. It\'s about lived experience becoming useful knowledge. It\'s about a rural boy learning in formal systems, then bringing those skills back home to empower the next generation.</string>

<!-- Ubuntu Strings -->
<string name="ubuntu_title">Ubuntu: "I Am Because We Are"</string>
<string name="ubuntu_description">This ancient African philosophy guides every decision, every product, and every interaction in our ecosystem. Ubuntu teaches us that our humanity is bound up in the humanity of others. My father\'s barefoot journey to school is part of my story. My son\'s access to tools I didn\'t have is part of the next chapter.</string>

<string name="ubuntu_family_first">Family First</string>
<string name="ubuntu_family_first_desc">"I am a father to my son; all else is a means to this end"</string>

<string name="ubuntu_community_strength">Community Strength</string>
<string name="ubuntu_community_strength_desc">Extended family as safety net, not formal systems</string>

<string name="ubuntu_impact_over_income">Impact Over Income</string>
<string name="ubuntu_impact_over_income_desc">All books free, personal use free forever</string>

<!-- Stats Strings -->
<string name="stat_living_experience">Years of Living Experience</string>
<string name="stat_living_experience_value">43</string>

<string name="stat_books_published">Books Published (All Free)</string>
<string name="stat_books_published_value">15+</string>

<string name="stat_years_as_father">Years as Father</string>
<string name="stat_years_as_father_value">15+</string>

<string name="stat_ecosystem_platforms">Ecosystem Platforms</string>
<string name="stat_ecosystem_platforms_value">9</string>

<!-- Timeline Strings -->
<string name="timeline_1_year">1982-2003</string>
<string name="timeline_1_title">Born in Transkei - Mlandeli &amp; Notemba\'s Son</string>
<string name="timeline_1_description">Born in 1982 to parents who modeled entrepreneurship and Ubuntu. Grew up in villages—Mahasana, Lenane, Kiriyatswana—where my father walked barefoot to school, where storytelling by firelight was education, where extended family was your safety net. This foundation shaped everything: the value of lived experience, the strength of informal systems, the duty to uplift those who come after.</string>

<string name="timeline_2_year">2003-2012</string>
<string name="timeline_2_title">From Rural Boy to Safety Leader</string>
<string name="timeline_2_description">At 18, independent. At 21, providing for myself. Junior Environmental Health Practitioner (EC Dept of Health), Best Trainee at Anglo Platinum (2004), OHS leadership at Metrorail, Liberty Group, 5G. Studied law briefly—aspired to justice, dropped out when I saw the corruption. Real justice happens through lived experience and practical action, not courtrooms.</string>

<string name="timeline_3_year">2013-2022</string>
<string name="timeline_3_title">Boardrooms &amp; Children\'s Courts</string>
<string name="timeline_3_description">Guided enterprise risk for Telkom/Gyro, advised corporate boards on resilience. But the real fight was personal: Children\'s Court battles exposed systemic gender bias against fathers. Mapped every injustice, documented the discrimination. My son\'s rights became my mission—everything else was just a means to this end.</string>

<string name="timeline_4_year">2023</string>
<string name="timeline_4_title">15+ Books - All Free &amp; Open</string>
<string name="timeline_4_description">"Goliath\'s Reckoning" exposed gender bias in courts. "The Homeschooling Father" shared what I learned taking control of my son\'s education. "Beyond Redress" challenged race-based policies. "Safety First" series opened OHS careers to everyone—no tertiary qualification required. "Getting to Know Yourself" traced Xhosa heritage. Every book free—impact over income, empowerment over profit.</string>

<string name="timeline_5_year">2023-Present</string>
<string name="timeline_5_title">Mlandeli-Notemba Investments (MNI) Ecosystem</string>
<string name="timeline_5_description">Named for my parents. Built to solve real problems: Sonny Network (safety I wish I had), Piggyback (ride-sharing &amp; parcel delivery for rural areas), LifeSync (homeschooling + family governance), DocuHelp, BizHelp, Flamea (legal advocacy). Business organogram mirrors family organogram. Tech learned in boardrooms, returned to serve the roots. Personal use: free forever.</string>

<!-- Books Section -->
<string name="books_title">15+ Books - All Free &amp; Open</string>
<string name="books_description">The journey from lived experience to ecosystem was crystallised in books. Each title documents not only professional expertise but also the personal battles, cultural heritage, and family values that shaped the vision.</string>
<string name="books_google_play_button">View All Books on Google Play</string>
<string name="books_youtube_button">Free Audiobooks on YouTube</string>
```

---

## 📋 Implementation Checklist

### Phase 1: Content Updates (2-3 hours)
- [ ] Update strings.xml with all new content
- [ ] Update timeline data in ViewModel/Repository
- [ ] Update stats to human-focused metrics
- [ ] Add Ubuntu philosophy section to About/Journey fragment

### Phase 2: UI Updates (2-3 hours)
- [ ] Update hero section layout (fragment_journey.xml)
- [ ] Add Ubuntu values cards UI
- [ ] Update timeline item layouts with new content
- [ ] Add books section with Google Play and YouTube buttons

### Phase 3: Testing (1 hour)
- [ ] Test all text displays correctly
- [ ] Test external links (Google Play, YouTube)
- [ ] Test responsive layout on different screen sizes
- [ ] Verify timeline scrolls smoothly

### Phase 4: Consistency Check (30 minutes)
- [ ] Compare Android app with web app journey page
- [ ] Verify birth year shows 1982 (not 1985)
- [ ] Verify all quotes match
- [ ] Verify stats match

---

## 🚀 Deployment Notes

**Total Estimated Time:** 6 hours

**Priority Order:**
1. Strings.xml updates (foundation)
2. Timeline data updates (core content)
3. Stats updates (quick wins)
4. Ubuntu section (new feature)
5. Books section buttons (external integration)

**Testing Focus:**
- Content accuracy (birth year, quotes, stats)
- External link functionality
- UI consistency with web app
- Accessibility (screen readers)

---

## 📱 Screenshots to Update

After implementation, update these promotional materials:
- [ ] Play Store screenshots (journey/about section)
- [ ] App preview video (if applicable)
- [ ] Marketing materials showing Ubuntu values
- [ ] Social media graphics with new quotes

---

## ✅ Success Criteria

- [ ] Android app journey section matches web app narrative
- [ ] 65% human story, 35% professional emphasis achieved
- [ ] All stats updated to human-focused metrics
- [ ] Ubuntu philosophy prominently featured
- [ ] Birth year shows 1982 consistently
- [ ] Books section links to external platforms
- [ ] Mission statement clear: "I am a father to my son; all else is a means to this end"

---

**Philosophy:**
> Impact over income. Ubuntu over ego. Family over everything.

**Ready for Android development session!**
