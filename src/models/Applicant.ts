import type { ObjectId } from "mongodb"

// Location interface
export interface Location {
  province: string
  district: string
  sector: string
  cell: string
  village: string
}

// Basic information interface
export interface BasicInfo {
  projectName: string
  orgName: string
  orgType: string
  repName: string
  email: string
  location: Location
}

// Contact person interface
export interface ContactPerson {
  firstName: string
  familyName: string
  email: string
  ifNotLegalRep: string
}

// Project details interface
export interface ProjectDetails {
  partners: string
  teamMembers: string
  title: string
  placeOfImplementation: string
  startDate: string
  endDate: string
  description: string
  mainObjective: string
  specificObjectives: string
  implementationPlan: string
  targetGroups: string
  communicationPlan: string
}

// Budget category interface
export interface BudgetCategory {
  explanation: string
  cost: number
}

// Budget data interface
export interface BudgetData {
  category1: BudgetCategory
  category2: BudgetCategory
  category3: BudgetCategory
  category4: BudgetCategory
  category5: BudgetCategory
  category6: BudgetCategory
  totalCost: number
}

// Supporting document interface
export interface SupportingDocument {
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
}

// Applicant interface (main model)
export interface Applicant {
  _id?: ObjectId
  basicInfo: BasicInfo
  contactPerson: ContactPerson
  projectDetails: ProjectDetails
  budgetData: BudgetData
  supportingDocuments: SupportingDocument[]
  moreInfoDocument?: SupportingDocument
  status: "draft" | "submitted" | "under-review" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}

// Function to create a new applicant
export function createApplicantObject(data: any): Omit<Applicant, "_id"> {
  return {
    basicInfo: {
      projectName: data.basicInfo.projectName,
      orgName: data.basicInfo.orgName,
      orgType: data.basicInfo.orgType,
      repName: data.basicInfo.repName,
      email: data.basicInfo.email,
      location: {
        province: data.basicInfo.location.province,
        district: data.basicInfo.location.district,
        sector: data.basicInfo.location.sector,
        cell: data.basicInfo.location.cell,
        village: data.basicInfo.location.village,
      },
    },
    contactPerson: {
      firstName: data.contactPerson.firstName,
      familyName: data.contactPerson.familyName,
      email: data.contactPerson.email,
      ifNotLegalRep: data.contactPerson.ifNotLegalRep,
    },
    projectDetails: {
      partners: data.projectDetails.partners,
      teamMembers: data.projectDetails.teamMembers,
      title: data.projectDetails.title,
      placeOfImplementation: data.projectDetails.placeOfImplementation,
      startDate: data.projectDetails.startDate,
      endDate: data.projectDetails.endDate,
      description: data.projectDetails.description,
      mainObjective: data.projectDetails.mainObjective,
      specificObjectives: data.projectDetails.specificObjectives,
      implementationPlan: data.projectDetails.implementationPlan,
      targetGroups: data.projectDetails.targetGroups,
      communicationPlan: data.projectDetails.communicationPlan,
    },
    budgetData: {
      category1: {
        explanation: data.budgetData.category1Explanation,
        cost: data.budgetData.category1Cost,
      },
      category2: {
        explanation: data.budgetData.category2Explanation,
        cost: data.budgetData.category2Cost,
      },
      category3: {
        explanation: data.budgetData.category3Explanation,
        cost: data.budgetData.category3Cost,
      },
      category4: {
        explanation: data.budgetData.category4Explanation,
        cost: data.budgetData.category4Cost,
      },
      category5: {
        explanation: data.budgetData.category5Explanation,
        cost: data.budgetData.category5Cost,
      },
      category6: {
        explanation: data.budgetData.category6Explanation,
        cost: data.budgetData.category6Cost,
      },
      totalCost: data.budgetData.totalCost,
    },
    supportingDocuments: data.supportingDocuments || [],
    moreInfoDocument: data.moreInfoDocument,
    status: "submitted",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
