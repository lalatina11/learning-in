import MajorTable from '@/components/admin-components/major-table';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import CreateOrUpdateMajorForm from '@/components/forms/create-or-update-or-delete-major-form';
import { Button } from '@/components/ui/button';
import { Major } from '@/types';
import { Plus } from 'lucide-react';

interface Props {
    majors: Array<Major>;
}

const School = ({ majors }: Props) => {
    return (
        <DashboardPageContainer>
            <div className="flex flex-col gap-2">
                <CreateOrUpdateMajorForm type="create">
                    <Button className="w-fit">
                        <Plus /> Tambah Jurusan
                    </Button>
                </CreateOrUpdateMajorForm>
                <MajorTable majors={majors} />
            </div>
        </DashboardPageContainer>
    );
};

export default School;
