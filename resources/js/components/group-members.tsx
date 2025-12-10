'use client';

import { EmblaOptionsType } from 'embla-carousel';
import { GroupMembersMotionCarousel } from './animate-ui/components/community/group-members-motion-carousel';

const GroupMembers = () => {
    const OPTIONS: EmblaOptionsType = { loop: true };
    const SLIDE_COUNT = 5;
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

    return <GroupMembersMotionCarousel slides={SLIDES} options={OPTIONS} />;
};

export default GroupMembers;
