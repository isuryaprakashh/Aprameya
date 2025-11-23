import { useState } from 'react';
import {
    ButtonTrace,
    ButtonHold,
    ButtonScramble,
    ButtonPrism,
    ButtonSonar
} from '../components/ButtonLibrary';
import {
    Slider,
    IntegrationHub,
    CleanStats,
    IDCard
} from '../components/InterfaceModules';
import {
    ProximityMatrix,
    MagneticVectorField,
    VoidAurora
} from '../components/InteractiveBackgrounds';
import OperativeRoster from '../components/OperativeRoster';

const DesignSystem = () => {
    return (
        <div className="min-h-screen w-full relative z-10 pb-32 pt-12 px-8 max-w-7xl mx-auto">
            <h1 className="text-5xl font-medium tracking-tighter text-[var(--text-primary)] mb-12">
                APRAMEYA <span className="text-[var(--text-secondary)]">V6.0 SYSTEM</span>
            </h1>

            {/* 01. BUTTON LIBRARY */}
            <section className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                    <span className="w-6 h-6 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] flex items-center justify-center font-mono">01</span>
                    <h2 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest">Advanced Button Library</h2>
                </div>
                <div className="glass-panel p-10 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <p className="text-xs text-[var(--text-secondary)] font-mono uppercase">1. Cyber Border Trace</p>
                        <ButtonTrace />
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs text-[var(--text-secondary)] font-mono uppercase">2. Hold Trigger (Safety)</p>
                        <ButtonHold />
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs text-[var(--text-secondary)] font-mono uppercase">3. Data Decryption</p>
                        <ButtonScramble />
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs text-[var(--text-secondary)] font-mono uppercase">4. Glass Prism</p>
                        <ButtonPrism />
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs text-[var(--text-secondary)] font-mono uppercase">5. Sonar Broadcast</p>
                        <ButtonSonar />
                    </div>
                    <div className="space-y-4">
                        <p className="text-xs text-[var(--text-secondary)] font-mono uppercase">6. Input Field</p>
                        <div className="input-group">
                            <input type="text" className="input-clean" placeholder=" " id="inp1" />
                            <label htmlFor="inp1" className="input-label">Command Line</label>
                        </div>
                    </div>
                </div>
            </section>

            {/* 02. INTERFACE MODULES */}
            <section className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                    <span className="w-6 h-6 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] flex items-center justify-center font-mono">02</span>
                    <h2 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest">Interface Modules</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Slider />
                    <IntegrationHub />
                    <CleanStats />
                    <IDCard />
                </div>
            </section>

            {/* 03. INTERACTIVE BACKGROUNDS */}
            <section className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                    <span className="w-6 h-6 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] flex items-center justify-center font-mono">03</span>
                    <h2 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest">Interactive Backgrounds</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="clean-card p-6">
                        <p className="text-xs text-[var(--text-secondary)] font-mono mb-4 uppercase">1. Proximity Matrix</p>
                        <ProximityMatrix />
                    </div>
                    <div className="clean-card p-6">
                        <p className="text-xs text-[var(--text-secondary)] font-mono mb-4 uppercase">2. Magnetic Vector Field</p>
                        <MagneticVectorField />
                    </div>
                    <div className="clean-card p-6 md:col-span-2">
                        <p className="text-xs text-[var(--text-secondary)] font-mono mb-4 uppercase">3. Void Aurora</p>
                        <VoidAurora />
                    </div>
                </div>
            </section>

            {/* 04. OPERATIVE ROSTER */}
            <section className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                    <span className="w-6 h-6 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] flex items-center justify-center font-mono">04</span>
                    <h2 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-widest">Operative Roster</h2>
                </div>
                <OperativeRoster />
            </section>
        </div>
    );
};

export default DesignSystem;
