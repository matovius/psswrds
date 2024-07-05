<script lang="ts">
	import { browser } from "$app/environment";
	import type { Configs } from "$lib/scripts/types";
	import { SavedConfigs } from "$lib/stores/configs";
	import { onDestroy, onMount } from "svelte";
	import { quadInOut, quadOut } from "svelte/easing";
	import { fade, fly } from "svelte/transition";

  let passwordDisplay: HTMLDivElement;
  let passwordLength: number = 8;
  let inclusions: string[] = [];
  let newPassword: string = "";
  let includeNumbers: boolean = false;
  let includeSymbols: boolean = false;
  let isConfigMenuOpen: boolean = false;
  let isPageLoaded: boolean = false;

  const UPPERCASE_LETTERS: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWERCASE_LETTERS: string = "abcdefghijklmnopqrstuvwxyz";
  const SYMBOLS: string = "`~!@#$%^&*()_-+=[]{};:'<,.>/?";
  const NUMBERS: string = "1234567890";
  const ALL_CHARACTERS = UPPERCASE_LETTERS + LOWERCASE_LETTERS + SYMBOLS + NUMBERS;

  const unsubConfigs = SavedConfigs.subscribe((configs) => {
    if (browser) {
      localStorage.setItem("configs", JSON.stringify(configs));
    }

    passwordLength = configs.passwordLength;
    includeNumbers = configs.includesNumbers;
    includeSymbols = configs.includesSymbols;
  });
  
  function getRandomIndex(size: number) {
    return Math.floor(Math.random() * size);
  }
  function getRandomCharacter(group: string | any[]) {
    return group[getRandomIndex(group.length)];
  }

  function getRandomPassword() {
    inclusions = [];
    inclusions.push(UPPERCASE_LETTERS, LOWERCASE_LETTERS);

    if ($SavedConfigs.includesNumbers) {
      inclusions.push(NUMBERS);
    }
    if ($SavedConfigs.includesSymbols) {
      inclusions.push(SYMBOLS);
    }

    let newPasswordArray: string[] = [];
    for (let index = 0; index < $SavedConfigs.passwordLength; index++) {
      // Get a random item from the inclusions array
      let randomLookup = inclusions[getRandomIndex(inclusions.length)];
      let randomCharacter = getRandomCharacter(randomLookup);
      newPasswordArray.push(randomCharacter);
    }

    newPassword = newPasswordArray.join("");

    revealPassword();
  }
  function revealPassword() {
    let iteration: number = -5;

    const interval = setInterval(() => {
      const passwordArray = newPassword.split("");
      passwordDisplay.innerText = passwordArray.map((character, index) => {
        return (index < iteration ? character : getRandomCharacter(inclusions[getRandomIndex(inclusions.length)]));
      }).join("");

      if ((iteration += 1) > passwordLength) {
        clearInterval(interval);
      }
    }, 100);
  }
  function copyPassword() {
    if (browser) {
      navigator.clipboard.writeText(newPassword);
    }
  }

  function saveConfigs() {
    let newConfigs: Configs = {
      passwordLength: passwordLength,
      includesNumbers: includeNumbers,
      includesSymbols: includeSymbols
    }

    SavedConfigs.set(newConfigs);
    isConfigMenuOpen = false;
  }

  function cancelConfigs() {
    passwordLength = $SavedConfigs.passwordLength;
    includeNumbers = $SavedConfigs.includesNumbers;
    includeSymbols = $SavedConfigs.includesSymbols;

    isConfigMenuOpen = false;
  }

  onMount(() => {
    setTimeout(() => {
      isPageLoaded = true;
    }, 1000);
    setTimeout(() => {
      passwordDisplay.style.opacity = "1";
    }, 1500);
    setTimeout(() => {
      getRandomPassword();
    }, 2000);
  });

  onDestroy(() => {
    unsubConfigs();
  });
</script>

<svelte:head>
  <title>psswrd</title>
</svelte:head>

{#if isPageLoaded}
  <main class="main" transition:fade={{ duration: 200, easing: quadInOut }}>
    <div class="generator">
      <div class="password-display" bind:this={passwordDisplay}></div>
      <div class="controls">
        <button id="generate" class="button" on:click={getRandomPassword}>
          <span>generate</span>
        </button>
        <button id="copy" class="button" on:click={copyPassword}>
          <span>copy</span>
        </button>
      </div>
      <div class="configs">
        {#if !isConfigMenuOpen}
          <button id="config" class="button" on:click={() => { isConfigMenuOpen = true; }} transition:fly={{ duration: 200, easing: quadOut, x: 0, y: "4px", opacity: 0 }}>
            <span>configure</span>
          </button>
        {:else}
          <div
            role="button"
            class="backdrop"
            transition:fade={{ duration: 100, easing: quadOut }}
          >
          </div>
          <form class="configs-form" on:submit|preventDefault transition:fly={{ duration: 100, easing: quadOut, x: 0, y: "-4px", opacity: 0 }}>
            <div class="heading">
              <span>configure</span>
            </div>
            <label for="password-length" style={`flex-direction: column;`}>
              <span style={`display: inline-block; width: 100%;`}>length</span>
              <input
                type="range"
                name="password-length"
                id="password-length"
                min="4" max="20"
                bind:value={passwordLength}
                style={`width: 100%;`}
              />
              <span style={`position: absolute; top: 0; right: 0;`}>{passwordLength}</span>
            </label>
            <label for="include-numbers">
              <input type="checkbox" name="include-numbers" id="include-numbers" bind:checked={includeNumbers} />
              <span>include numbers</span>
            </label>
            <label for="include-symbols">
              <input type="checkbox" name="include-symbols" id="include-symbols" bind:checked={includeSymbols} />
              <span>include symbols</span>
            </label>
            <button id="save-configs" class="button" on:click={saveConfigs}>
              <span>save</span>
            </button>
            <button id="cancel-configs" class="button" on:click={cancelConfigs}>
              <span>cancel</span>
            </button>
          </form>
        {/if}
      </div>
    </div>
  </main>
{/if}

<style>
  .main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
  .generator {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 96px;
  }

  .password-display {
    font-size: 24px;
    line-height: 1;
    height: 1em;
    opacity: 0;
  }
  .controls {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--size-1);
    padding-top: var(--size-5); /* 24px */

    & > .button {
      --pad-y: 12px;
      &#generate {
        --pad-x: 48px;
        background: var(--gray-0);
      }
      &#copy, &#config {
        --pad-x: 12px;
        color: var(--gray-0);
        background: var(--gray-9);
      }
    }
  }

  .configs {
    isolation: isolate;
    width: 100%;
    max-width: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 24px;
    padding-inline: 12px;
    position: relative;

    & > .button#config {
      --pad-y: 12px;
      --pad-x: 12px;
      color: var(--gray-0);
      width: 100%;
      background: var(--gray-9);
    }

    & > .backdrop {
      background: black;
      opacity: 0.6;
      position: fixed;
      inset: 0;
      z-index: 5;
    }
  }
  .configs-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 24px;
    border-radius: 24px;
    background: var(--gray-9);
    position: absolute;
    top: 24px;
    overflow: hidden;
    z-index: 10;

    & > label {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 12px;
      position: relative;
    }

    & > .button#save-configs {
      --pad-y: 12px;
      --pad-x: 12px;
      color: var(--gray-11);
      width: 100%;
      background: var(--gray-0);
    }

    & > .button#cancel-configs {
      --pad-y: 12px;
      --pad-x: 12px;
      color: var(--gray-0);
      width: 100%;
      background: var(--gray-11);
    }
  }

  :global(.sr-only) {
    width: 1px;
    height: 1px;
    clip-path: rect(0,0,0,0);
    opacity: 0;
    visibility: invisible;
    position: absolute;
  }
</style>