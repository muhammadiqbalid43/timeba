import supabase from "@/lib/supabase-client";
import type {
  ProjectSchemaFormValues,
  TransformedProjectData,
} from "../schemas/project-schemas";

export const projectsServices = {
  async getProjects(): Promise<ProjectSchemaFormValues[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      throw error;
    }

    return data as ProjectSchemaFormValues[];
  },

  async createProject(values: TransformedProjectData) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    const { error } = await supabase
      .from("projects")
      .insert({ ...values, user_id: user.id });

    if (error) {
      throw error;
    }
  },

  async updateProject(id: string, values: ProjectSchemaFormValues) {
    const { error } = await supabase
      .from("projects")
      .update(values)
      .eq("id", id);

    if (error) {
      throw new Error(`Gagal update project: ${error.message}`);
    }
    return true;
  },
};
