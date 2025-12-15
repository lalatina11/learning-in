'use client';

import { GroupMemberSlide } from '@/types';
import { EmblaOptionsType } from 'embla-carousel';
import { GroupMembersMotionCarousel } from './animate-ui/components/community/group-members-motion-carousel';

export const SLIDES = [
    { image: '/ires.jpeg', name: 'Ires Agil Karisma', nim: '19240730' },
    { image: '/candra.png', name: 'Candra Rahmadan', nim: '19240731' },
    { image: '/yoga.jpg', name: 'Yoga Rozan Pradana', nim: '19240730' },
    { image: '/aga.jpg', name: 'Aga Panggih Yanuar Saputra', nim: '19240297' },
    { image: '/unggul.PNG', name: 'Unggul Rahmat Pradana', nim: '19240675' },
    { image: 'augusta.webp', name: 'Augusta Catur Hasmoro', nim: '19241222' },
] as Array<GroupMemberSlide>;

const GroupMembers = () => {
    const OPTIONS: EmblaOptionsType = { loop: true };

    return <GroupMembersMotionCarousel slides={SLIDES} options={OPTIONS} />;
};

export default GroupMembers;
