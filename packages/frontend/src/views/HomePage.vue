<script setup lang="ts">
import BossStatus from "@/components/BossStatus.vue";
import CampaignProgress from "@/components/CampaignProgress.vue";
import FeatureCard from "@/components/FeatureCard.vue";

const features = [
  { number: "1", icon: "DRAFT", title: "Draft your party", description: "Four managers. One shared mission." },
  { number: "2", icon: "SCORE", title: "Score damage", description: "Every fantasy point strikes the boss." },
  { number: "3", icon: "BREAK", title: "Break its defense", description: "Complete the weekly weakness." },
];
</script>

<template>
  <main class="home-page">
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">Fantasy football co-op campaign</p>
        <h1 id="hero-title">Your team.<br />One realm.<br /><span>18 bosses.</span></h1>
        <p class="hero-description">Draft NFL players. Combine fantasy points. Defeat a new boss every week.</p>
        <div class="hero-actions">
          <RouterLink class="button button-primary" to="/campaign">Create campaign</RouterLink>
          <RouterLink class="button button-secondary" to="/parties">Join with code</RouterLink>
        </div>
        <p class="hero-meta">Fantasy football <span>+</span> co-op campaign <span>+</span> a higher game</p>
      </div>
      <div class="hero-art" aria-label="A fantasy football arena beneath a many-headed boss">
        <div class="arena-glow"></div>
        <div class="boss-silhouette">BOSS</div>
        <div class="hero-players"><span>8</span><span>11</span><span>17</span><span>23</span></div>
        <BossStatus />
      </div>
    </section>
    <section class="feature-grid" aria-label="How the campaign works">
      <FeatureCard v-for="feature in features" :key="feature.number" v-bind="feature" />
    </section>
    <CampaignProgress />
  </main>
</template>

<style scoped>
.home-page {
  max-width: 1680px;
  margin: 0 auto;
}
.hero-section {
  display: grid;
  grid-template-columns: minmax(360px, 0.85fr) minmax(500px, 1.35fr);
  min-height: 540px;
  border-bottom: 4px solid var(--border-color);
  background: #031321;
}
.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 5vw, 5rem) clamp(1.5rem, 4vw, 4rem);
  background: linear-gradient(135deg, #031321 0%, #071d31 100%);
}
.eyebrow,
.hero-meta {
  color: #6b9aba;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
h1 {
  margin: 1rem 0;
  color: var(--secondary-color);
  font-size: clamp(3rem, 5.5vw, 6.5rem);
  line-height: 0.94;
  text-transform: uppercase;
}
h1 span {
  color: var(--primary-color);
}
.hero-description {
  max-width: 34rem;
  color: #d7e6eb;
  font-size: clamp(1rem, 1.5vw, 1.35rem);
  line-height: 1.5;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
}
.button {
  display: inline-block;
  padding: 1rem 1.5rem;
  border: 2px solid var(--primary-color);
  color: var(--background-color);
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
}
.button-primary {
  background: var(--primary-color);
}
.button-secondary {
  color: var(--primary-color);
}
.button:hover,
.button:focus-visible {
  box-shadow: 0 0 0 3px #fff2b3;
}
.hero-meta {
  margin: 0;
}
.hero-meta span {
  color: var(--primary-color);
  padding: 0 0.35rem;
}
.hero-art {
  position: relative;
  min-height: 540px;
  overflow: hidden;
  background: radial-gradient(circle at 50% 22%, #1f5690 0, #0d2c53 24%, #061523 65%);
  isolation: isolate;
}
.hero-art::before,
.hero-art::after {
  position: absolute;
  content: "";
  inset: 12% 8% 0;
  border: 4px solid #204b6b;
  transform: perspective(420px) rotateX(38deg);
  transform-origin: bottom;
}
.hero-art::after {
  inset: auto 14% 10% 14%;
  height: 25%;
  border-color: #31775e;
  background: repeating-linear-gradient(90deg, transparent 0 19%, #46c58c 20% 20.5%);
}
.arena-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center bottom, #15977f66, transparent 55%);
  z-index: -1;
}
.boss-silhouette {
  position: absolute;
  top: 22%;
  left: 50%;
  color: #15283c;
  font-size: clamp(4rem, 12vw, 10rem);
  font-weight: 700;
  transform: translateX(-50%);
  text-shadow:
    0 0 0 #0e1723,
    0 0 35px #f43b35;
}
.hero-players {
  position: absolute;
  bottom: 13%;
  left: 50%;
  display: flex;
  gap: clamp(1rem, 3vw, 3rem);
  color: #fff;
  font-size: clamp(1.5rem, 3vw, 3rem);
  font-weight: 700;
  transform: translateX(-50%);
}
.hero-players span:nth-child(2),
.hero-players span:nth-child(4) {
  color: #e4483b;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
  background: #061523;
}
@media (max-width: 900px) {
  .hero-section {
    grid-template-columns: 1fr;
  }
  .hero-art {
    min-height: 380px;
  }
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .hero-actions,
  .button {
    width: 100%;
  }
  .hero-art {
    min-height: 300px;
  }
}
</style>
