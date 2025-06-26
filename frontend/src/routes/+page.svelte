<script lang="ts">
  let items = [
    { name: "Coffee", emoji: "☕" },
    { name: "Tea", emoji: "🍵" },
    { name: "Juice", emoji: "🧃" },
    { name: "Sandwich", emoji: "🥪" },
    { name: "Pizza", emoji: "🍕" },
    { name: "Cookie", emoji: "🍪" },
  ];

  let selectedItem = "";
  let qty = 1;
  let submitted = false;

  async function placeOrder() {
    if (!selectedItem || qty < 1) return;

    const res = await fetch("http://localhost:3000/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: selectedItem, qty }),
    });
    if (res.ok) submitted = true;
  }
</script>

<div class="background">
  <h1
    style="text-align: center; font-family: 'Courier New', Courier, monospace;"
  >
    Menu
  </h1>

  <div class="menu">
    {#each items as item}
      <div
        class="card {selectedItem === item.name ? 'selected' : ''}"
        on:click={() => {
          selectedItem = item.name;
          submitted = false;
        }}
        role="button"
        tabindex="0"
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === "") selectedItem = item.name;
        }}
        aria-pressed={selectedItem === item.name}
      >
        <div class="emoji">{item.emoji}</div>
        <div>{item.name}</div>
      </div>
    {/each}
  </div>

  <div class="container">
    <label style="font-family: 'Courier New', Courier, monospace;">
      Quantity:
      <input
        style="font-family: 'Courier New', Courier, monospace;"
        type="number"
        min="1"
        bind:value={qty}
      />
    </label>

    <button on:click={placeOrder} disabled={!selectedItem || qty < 1}>
      Place Order
    </button>
  </div>
</div>

{#if submitted}
  <p class="success">Order placed for {qty} x {selectedItem}!</p>
{/if}

<style>
  .background {
    background: linear-gradient(to bottom right, #ffffff, #cdd7f3);
    min-height: 100vh;
    padding: 2rem;
    box-sizing: border-box;
  }

  .menu {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    max-width: 600px;
    margin: 2rem auto;
    justify-content: center;
  }

  .card {
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    user-select: none;
    flex: 1 1 100px;
    transition: border-color 0.3s ease;
    background-color: rgba(253, 248, 252, 0.7);
    font-family: "Courier New", Courier, monospace;
  }

  .card.selected {
    border-color: #4caf50;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.5);
    background-color: #e8f5e9;
  }

  .emoji {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .container {
    justify-content: center;
    display: flex;
    align-items: center;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    margin-left: 0.5rem;
    font-family: "Courier New", Courier, monospace;
  }

  button:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
</style>
