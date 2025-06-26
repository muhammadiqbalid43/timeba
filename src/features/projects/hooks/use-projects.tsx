import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsServices } from "../services/projects-services";
import { toast } from "sonner";
import type {
  ProjectSchemaFormValues,
  TransformedProjectData,
} from "../schemas/project-schemas";

const convertToFormValues = (
  data: TransformedProjectData
): ProjectSchemaFormValues => ({
  ...data,
  hourly_rate:
    data.hourly_rate !== null ? data.hourly_rate.toString() : undefined,
});

export const useProjects = () => {
  const queryClient = useQueryClient();

  const getProjectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: projectsServices.getProjects,
  });

  const createProjectMutation = useMutation({
    mutationFn: projectsServices.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: TransformedProjectData;
    }) => projectsServices.updateProject(id, convertToFormValues(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    projects: getProjectsQuery.data,
    isProjectLoading: getProjectsQuery.isLoading,
    isErrorProject: getProjectsQuery.error,
    createProjectMutation: createProjectMutation.mutate,
    isCreatingProject: createProjectMutation.isPending,
    updateProjectMutation: updateProjectMutation.mutate,
  };
};
