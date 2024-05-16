<template>
  <header>
    <nav>
      <ul>
        <li><router-link exact-active-class="active" to="/">Home</router-link></li>
        <li><router-link exact-active-class="active" to="/add">Add Book</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
header {
  background-color: oklch(31.1% 0 0);
  padding: 1rem 2.5rem;
}
nav ul {
  list-style: none;
  display: flex;
  justify-content: flex-start;
}

nav li {
  margin-inline-end: 2rem;
  font-size: var(--fs-large);
  a {
    padding: 0.375rem;
    border-radius: 5px;
  }
}

.active {
  background-color: var(--clr-background);
}
</style>
