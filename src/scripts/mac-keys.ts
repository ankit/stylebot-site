const platform =
  (navigator as Navigator & { userAgentData?: { platform: string } })
    .userAgentData?.platform ?? navigator.platform;

if (/mac/i.test(platform)) {
  document.querySelectorAll<HTMLElement>('kbd[data-mac]').forEach((kbd) => {
    kbd.textContent = kbd.dataset.mac!;
  });
}
