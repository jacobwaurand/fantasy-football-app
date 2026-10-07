<template>
  <aside class="boss-status" aria-label="Current boss status">
    <p>Week 7 boss</p>
    <h2>Four-mouthed colossus</h2>
    <div class="health-row">
      <span class="health-bar"><span></span></span><strong>420 HP</strong>
    </div>
    <p class="weakness">Weakness: 3 TE touchdowns</p>
  </aside>
</template>

<style scoped>
.boss-status {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: min(360px, calc(100% - 3rem));
  padding: 1rem;
  border: 3px solid #35526a;
  background: #061523ee;
  box-shadow: 7px 7px #020a12;
}
.boss-status p {
  margin: 0 0 0.5rem;
  color: #a6cbe3;
  font-size: 0.8rem;
  text-transform: uppercase;
}
.boss-status h2 {
  margin: 0 0 1rem;
  color: var(--secondary-color);
  font-size: 1rem;
  text-transform: uppercase;
}
.health-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.health-bar {
  flex: 1;
  height: 1rem;
  border: 2px solid #f0dce2;
}
.health-bar span {
  display: block;
  width: 78%;
  height: 100%;
  background: #f04a4a;
}
.health-row strong {
  color: var(--secondary-color);
  white-space: nowrap;
}
.weakness {
  margin-top: 0.8rem !important;
}
</style>
