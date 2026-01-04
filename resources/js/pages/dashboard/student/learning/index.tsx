import { Button } from '@/components/animate-ui/components/buttons/button';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassRoomWithMajor, StudyRoom as DefaultStudyRoom, LearningSubject, User } from '@/types';
import { PageProps as DefaultPageProps } from '@/types/page-props';
import { Link, usePage } from '@inertiajs/react';
import { List, ScanEyeIcon } from 'lucide-react';

interface StudyRoom extends DefaultStudyRoom {
    teacher: User;
    learning_subject: LearningSubject;
    classroom: ClassRoomWithMajor;
}

interface PageProps extends DefaultPageProps {
    studyRooms: Array<StudyRoom>;
}

const LearningIndex = () => {
    const { studyRooms } = usePage().props as PageProps;
    console.log({ studyRooms });

    return (
        <DashboardPageContainer>
            <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {studyRooms.length > 0
                    ? studyRooms.map((studyRoom) => (
                          <Card key={studyRoom.id} className="flex max-h-[350px] w-full flex-col items-center justify-between">
                              <CardHeader className="w-full text-center">
                                  <CardTitle className="">{studyRoom.learning_subject.name}</CardTitle>
                                  <CardDescription>
                                      {studyRoom.classroom.grade} {studyRoom.classroom.major.name}
                                  </CardDescription>
                              </CardHeader>
                              <CardContent className="flex w-full flex-col justify-start gap-2 text-sm">
                                  <span>Guru: {studyRoom.teacher.name}</span>
                                  <span>Nip: {studyRoom.teacher.master_number}</span>
                              </CardContent>
                              <CardFooter className="grid grid-cols-2 gap-3">
                                  <Button asChild className="col-span-2">
                                      <Link href={`/dashboard/learning/${studyRoom.id}`}>
                                          <ScanEyeIcon /> <span className="hidden text-xs md:inline">Detail</span>
                                      </Link>
                                  </Button>
                                  <Button asChild>
                                      <Link href={`/dashboard/learning/${studyRoom.id}#modules`}>
                                          <List /> <span className="hidden text-xs md:inline">Module</span>
                                      </Link>
                                  </Button>
                                  <Button asChild>
                                      <Link href={`/dashboard/learning/${studyRoom.id}#tasks`}>
                                          <List /> <span className="hidden text-xs md:inline">Tugas</span>
                                      </Link>
                                  </Button>
                              </CardFooter>
                          </Card>
                      ))
                    : null}
            </div>
        </DashboardPageContainer>
    );
};

export default LearningIndex;
