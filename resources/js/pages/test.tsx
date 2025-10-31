import { Button } from '@/components/animate-ui/components/buttons/button';
import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/components/buttons/ripple';
import {
    Dialog,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPanel,
    DialogTitle,
} from '@/components/animate-ui/components/headless/dialog';
import { Checkbox } from '@/components/animate-ui/components/radix/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/animate-ui/components/radix/hover-card';
import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
import { ThemeTogglerDemo } from '@/components/ThemeToggler';
import { Label } from '@/components/ui/label';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Test = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="flex flex-col items-center justify-center">
            <h1>Test</h1>
            <SlidingNumber fromNumber={0} number={100} />
            <ThemeTogglerDemo direction="ltr" />
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>Open</DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <span>Profile</span>
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>Billing</span>
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>Settings</span>
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>Keyboard shortcuts</span>
                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <span>Team</span>
                            </DropdownMenuItem>

                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <span>Invite users</span>
                                    <ChevronRight />
                                </DropdownMenuSubTrigger>

                                <DropdownMenuSubContent>
                                    <DropdownMenuItem>
                                        <span>Email</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span>Message</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <span>More...</span>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            <DropdownMenuItem>
                                <span>New Team</span>
                                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                            <span>Log out</span>
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>{' '}
            </div>
            <div>
                <RippleButton variant="default" onClick={() => setIsOpen(true)}>
                    Open Dialog
                    <RippleButtonRipples scale={10} transition={{ duration: 0.6, ease: 'easeInOut' }} />
                </RippleButton>
                <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                    <DialogPanel>
                        <DialogHeader>
                            <DialogTitle>Dialog Title</DialogTitle>
                            <DialogDescription>Dialog Description</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <button>Accept</button>
                        </DialogFooter>
                        <DialogClose>Close</DialogClose>
                    </DialogPanel>
                </Dialog>
            </div>
            <div>
                <Label className="flex items-center gap-x-3">
                    <Checkbox />
                    Accept terms and conditions
                </Label>
            </div>
            <div>
                <HoverCard>
                    <HoverCardTrigger>
                        <Button>Hover me</Button>
                    </HoverCardTrigger>
                    <HoverCardContent side="top" sideOffset={20}>
                        <p>Hover card content</p>
                    </HoverCardContent>
                </HoverCard>
            </div>
        </div>
    );
};

export default Test;
