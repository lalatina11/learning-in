import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { ThemeToggler, type Direction, type Resolved, type ThemeSelection } from '@/components/animate-ui/primitives/effects/theme-toggler';
import { useEffect, useState } from 'react';

interface ModeToggleProps {
    direction?: Direction;
}

export const ModeToggle = ({ direction }: ModeToggleProps) => {
    const [mounted, setMounted] = useState(false);
    const { theme, resolvedTheme, setTheme, systemTheme } = useTheme();

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        }
        if (mounted && theme === 'system') {
            setTheme(systemTheme === 'dark' ? 'dark' : 'light');
        }
    }, [mounted, theme, setMounted, setTheme, systemTheme]);

    if (!mounted)
        return (
            <button className="cursor-pointer">
                <Moon />
            </button>
        );

    return (
        <ThemeToggler theme={theme as ThemeSelection} resolvedTheme={resolvedTheme as Resolved} setTheme={setTheme} direction={direction}>
            {({ effective, toggleTheme }) => {
                const nextTheme = effective === 'dark' ? 'light' : 'dark';

                return (
                    <button className="cursor-pointer" onClick={() => toggleTheme(nextTheme)}>
                        {effective === 'system' ? <Monitor /> : effective === 'dark' ? <Moon /> : <Sun />}
                    </button>
                );
            }}
        </ThemeToggler>
    );
};
