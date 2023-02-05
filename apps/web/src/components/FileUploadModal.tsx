import { Transition, Dialog } from '@headlessui/react';
import { useMutation } from '@tanstack/react-query';
import { Fragment } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type Props = {
    isOpen: boolean;
    closeModal: () => void;
}

type ImportFormInputs = {
    file: FileList;
}

const FileUploadModal = ({ isOpen, closeModal }: Props) => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ImportFormInputs>();
    const mutation = useMutation({
        mutationFn: async (body: File) => {
            await fetch('/api/fileupload', {
                method: 'POST',
                body,
            });
        },
        onError: (error) => {
            console.error('Failed to submit files.', error);
            toast.error('Failed to submit files. Please try again.');
        },
        onSuccess: () => {
            toast.success('Successfully uploaded kindle highlights, go to books to see them.', { position: 'bottom-right' });
        }
    });

    const onSubmit = async ({ file }: ImportFormInputs) => {
        console.log(file[0]?.type);
        if (file[0]?.type !== 'text/plain') {
            setError('file', {
                type: 'fileType',
                message: 'File must be a text file.'
            });
            return;
        }
        await mutation.mutateAsync(file[0]!);
        closeModal();
    };

    console.log(errors);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="inline-flex self-center justify-self-center text-lg font-medium leading-6 text-gray-900"
                                >
                                    Upload a file
                                </Dialog.Title>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mt-2">
                                        <div className="flex flex-col justify-center items-center" >
                                            <input
                                                type="file"
                                                {...register('file', { required: true })}
                                                className="focus:ring-blue-500 focus:border-blue-500 flex-1 block rounded-none rounded-r-md ml-20 sm:text-sm border-gray-300"
                                                disabled={isSubmitting}
                                            />
                                            {errors.file && <p className="text-red-500 text-sm">{errors.file.message === '' ? 'File is required' : errors.file.message}</p>}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-row items-end justify-end gap-x-2 w-full">
                                        <button
                                            type="button"
                                            className="rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 flex flex-row"
                                            disabled={isSubmitting}
                                        >
                                            {
                                                isSubmitting
                                                    ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Uploading...
                                                        </>
                                                    )
                                                    : 'Upload'
                                            }
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default FileUploadModal