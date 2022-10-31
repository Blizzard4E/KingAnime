import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const THEME = writable(browser && localStorage.getItem("theme") || "0");
THEME.subscribe((val) => {
    if (browser) return (localStorage.theme = val)
  })