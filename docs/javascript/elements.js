function convertRemToPixels(rem) {    
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function adjustElements() {
  const tooltips = [...document.getElementsByTagName('toolTippedElement')];
  tooltips.forEach(tooltip => {
    const tooltipChildren = [...tooltip.children];
    const tip = tooltipChildren.filter(child => child.tagName.toLowerCase() === 'tooltip')[0];
    const text = tooltipChildren.filter(child => child.tagName.toLowerCase() === 'span')[0];
    if (tip && text) {
      const leftPos = (text.offsetWidth / 2) + (tip.offsetWidth / 2);
      tip.style.marginLeft = `-${leftPos}px`;
      const tipBeforeLeftPos = (tip.offsetWidth / 2) - (convertRemToPixels(1.4) / 2);
      tip.style.setProperty('--tip-before-left', `${tipBeforeLeftPos}px`);
    }
    if (text) {
      tooltip.style.width = `${text.offsetWidth}px`;
    }
  });
}

function scrollHandler() {
  if (document.getElementById('fileViewer').scrollTop > 0) {
    document.getElementById('scrollToTop').classList.remove('occult');
  } else {
    document.getElementById('scrollToTop').classList.add('occult');
  }
}

window.addEventListener('resize', adjustElements);
document.getElementById('fileViewer').addEventListener('scroll', scrollHandler);