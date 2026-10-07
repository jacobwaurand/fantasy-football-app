<script setup lang="ts">
import { ref } from "vue";

const isMenuOpen = ref(false);

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <header class="page-header">
    <RouterLink class="brand" to="/" @click="closeMenu">PIXEL REALM</RouterLink>

    <button
      class="menu-toggle"
      type="button"
      :aria-expanded="isMenuOpen"
      aria-controls="main-navigation"
      aria-label="Toggle navigation menu"
      @click="isMenuOpen = !isMenuOpen"
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>

    <nav id="main-navigation" class="header-navigation" :class="{ 'is-open': isMenuOpen }">
      <div class="header-tabs">
        <RouterLink to="/" exact-active-class="is-active" @click="closeMenu">Home</RouterLink>
        <RouterLink to="/campaign" active-class="is-active" @click="closeMenu">Campaign</RouterLink>
        <RouterLink to="/parties" active-class="is-active" @click="closeMenu">Parties</RouterLink>
        <RouterLink to="/rules" active-class="is-active" @click="closeMenu">Rules</RouterLink>
      </div>
      <RouterLink class="header-button" to="/login" @click="closeMenu">Login</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem clamp(1rem, 4vw, 3rem);
  background-color: var(--background-color);
  border-bottom: 5px solid var(--border-color);
}

.brand {
  flex-shrink: 0;
  color: var(--primary-color);
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
}

.header-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 2rem;
}

.header-tabs {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.header-tabs a {
  display: block;
  border: none;
  background-color: var(--background-color);
  color: var(--border-color);
  padding: 0.75rem 1rem;
  font: inherit;
  text-decoration: none;
}

.header-tabs a:hover,
.header-tabs a:focus-visible,
.header-tabs a.is-active {
  color: var(--primary-color);
  box-shadow: inset 0 -3px 0 var(--primary-color);
}

.header-button {
  flex-shrink: 0;
  background-color: var(--background-color);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  text-decoration: none;
}

.header-button:hover,
.header-button:focus-visible {
  background-color: var(--primary-color);
  color: var(--background-color);
}

.menu-toggle {
  display: none;
  width: 2.75rem;
  height: 2.5rem;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  background: transparent;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  height: 2px;
  margin: 4px 0;
  background-color: var(--primary-color);
}

@media (max-width: 720px) {
  .page-header {
    position: relative;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0;
    padding: 0.875rem 1rem;
  }

  .brand {
    font-size: clamp(1.75rem, 8vw, 2.5rem);
  }

  .menu-toggle {
    display: block;
  }

  .header-navigation {
    display: none;
    flex-basis: 100%;
    align-items: stretch;
    gap: 0.75rem;
    padding-top: 1rem;
  }

  .header-navigation.is-open {
    display: flex;
    flex-direction: column;
  }

  .header-tabs {
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
  }

  .header-tabs a {
    padding: 0.75rem;
  }

  .header-button {
    text-align: center;
  }
}
</style>
