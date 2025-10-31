import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { ThemeToggler, type Direction, type Resolved, type ThemeSelection } from '@/components/animate-ui/primitives/effects/theme-toggler';

interface ThemeTogglerDemoProps {
    direction?: Direction;
}

export const ThemeTogglerDemo = ({ direction }: ThemeTogglerDemoProps) => {
    const { theme, resolvedTheme, setTheme } = useTheme();

    return (
        <ThemeToggler theme={theme as ThemeSelection} resolvedTheme={resolvedTheme as Resolved} setTheme={setTheme} direction={direction}>
            {({ effective, toggleTheme }) => {
                const nextTheme = effective === 'dark' ? 'light' : effective === 'system' ? 'dark' : 'system';

                return (
                    <button className="cursor-pointer" onClick={() => toggleTheme(nextTheme)}>
                        {effective === 'system' ? <Monitor /> : effective === 'dark' ? <Moon /> : <Sun />}
                    </button>
                );
            }}
        </ThemeToggler>
    );
};
