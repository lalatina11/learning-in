import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Direction, Resolved, ThemeSelection, ThemeToggler } from './animate-ui/primitives/effects/theme-toggler';
import { Button } from './ui/button';
import { ButtonGroup } from './ui/button-group';

interface ModeToggleProps {
    direction?: Direction;
}

export default function MultiThemeToggler({ direction }: ModeToggleProps) {
    const [mounted, setMounted] = useState(false);
    const { theme, resolvedTheme, setTheme, systemTheme } = useTheme();

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        }
        if (mounted && theme === 'system') {
            setTheme(systemTheme === 'dark' ? 'dark' : 'light');
            setMounted(true);
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
                const buttons = ['system', 'light', 'dark'] as Array<ThemeSelection>;
                return (
                    <ButtonGroup>
                        {buttons.map((item) => (
                            <Button variant={item === effective ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleTheme(item)}>
                                {item === 'system' ? <Monitor /> : item === 'dark' ? <Moon /> : <Sun />}
                            </Button>
                        ))}
                    </ButtonGroup>
                );
            }}
        </ThemeToggler>
    );
}
