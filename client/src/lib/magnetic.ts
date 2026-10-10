// Magnetic button effect utility
export function initMagneticButtons() {
    const magneticWraps = document.querySelectorAll('.magnetic-wrap');

    magneticWraps.forEach(wrap => {
        const btn = wrap.querySelector('.magnetic-target');
        if (!btn) return;

        wrap.addEventListener('mousemove', (e) => {
            const event = e as MouseEvent;
            const rect = wrap.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            (btn as HTMLElement).style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        wrap.addEventListener('mouseleave', () => {
            (btn as HTMLElement).style.transform = 'translate(0px, 0px)';
        });
    });
}
