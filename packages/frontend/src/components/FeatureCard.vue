<script setup lang="ts">
defineProps<{ number: string; icon: string; title: string; description: string }>();
</script>

<template>
  <article class="feature-card">
    <div class="feature-icon" aria-hidden="true">{{ icon }}</div>
    <div class="feature-copy">
      <div class="feature-heading">
        <span>{{ number }}</span>
        <h2>{{ title }}</h2>
      </div>
      <p>{{ description }}</p>
    </div>
  </article>
</template>

<style scoped>
.feature-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 130px;
  padding: 1rem;
  border: 3px solid #26465e;
  background: #061a2a;
  box-shadow: 5px 5px #020a12;
}
.feature-icon {
  display: grid;
  place-items: center;
  width: 6rem;
  height: 5rem;
  flex-shrink: 0;
  color: #8bb4ca;
  font-size: 0.65rem;
  text-align: center;
  transform: rotate(-4deg);
}
.feature-card:nth-child(2) .feature-icon {
  color: var(--primary-color);
}
.feature-card:nth-child(3) .feature-icon {
  color: #e75b55;
}
.feature-heading {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.feature-heading span {
  padding: 0.45rem 0.7rem;
  border: 2px solid #a4792e;
  color: var(--primary-color);
  font-size: 1.3rem;
}
.feature-heading h2 {
  margin: 0;
  color: #ffecc2;
  font-size: 1rem;
  text-transform: uppercase;
}
.feature-copy p {
  margin: 0.9rem 0 0;
  color: #b9d0dd;
  font-size: 0.75rem;
  line-height: 1.5;
}
</style>
