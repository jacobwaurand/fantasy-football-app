<script setup lang="ts">
const bosses = Array.from({ length: 18 }, (_, index) => index + 1);
</script>

<template>
  <section class="progress-section" aria-labelledby="progress-title">
    <h2 id="progress-title">Campaign progress</h2>
    <ol class="boss-list">
      <li v-for="boss in bosses" :key="boss" :class="{ current: boss === 6, defeated: boss < 6 }">{{ boss }}</li>
    </ol>
    <p class="progress-summary">18 bosses<br />18 weeks<br />A brighter league</p>
  </section>
</template>

<style scoped>
.progress-section {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 3rem);
  padding: 1.5rem;
  background: #031321;
}
.progress-section h2,
.progress-summary {
  color: #78a3c1;
  font-size: 0.8rem;
  text-transform: uppercase;
}
.progress-section h2 {
  width: 9rem;
  flex-shrink: 0;
}
.boss-list {
  display: grid;
  grid-template-columns: repeat(18, 1fr);
  gap: 0.4rem;
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
}
.boss-list li {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border: 2px solid #24455e;
  color: #557990;
  font-size: 0.75rem;
}
.boss-list li.defeated {
  color: var(--secondary-color);
  background: #1e7348;
}
.boss-list li.current {
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: inset 0 0 0 2px #593f1d;
}
.progress-summary {
  width: 8rem;
  flex-shrink: 0;
  margin: 0;
  line-height: 1.5;
}
@media (max-width: 900px) {
  .progress-section {
    flex-wrap: wrap;
  }
  .progress-section h2,
  .progress-summary {
    width: auto;
  }
  .boss-list {
    order: 3;
    flex-basis: 100%;
  }
}
@media (max-width: 560px) {
  .boss-list {
    grid-template-columns: repeat(9, 1fr);
  }
}
</style>
