export enum BID_STATUS {
  EDITING = 'editing',
  PENDING_ASSIGNMENT_TO_ENGINEER = 'pendingAssigmentToEngineer',
  PENDING_START_WORK_FROM_ENGINEER = 'pendingStartWorkFromEngineer',
  IN_WORK = 'inWork',
  PENDING_REVIEW_FROM_DISTRICT_LEADER = 'pendingReviewFromDistrictLeader',
  PENDING_REVIEW_FROM_STATION_WORKER = 'pendingReviewFromStationWorker',
  FAIL_REVIEW_FROM_DISTRICT_LEADER = 'failReviewFromDistrictLeader',
  FAIL_REVIEW_FROM_STATION_WORKER = 'failReviewFromStationWorker',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum BID_TODO_STATUS {
  PENDING = 'PENDING',
  IN_WORK = 'IN_WORK',
  COMPLETED = 'COMPLETED',
  DELETED = 'DELETED',
}

export const BID_STATUS_ALLOWING_UPDATES =
  BID_STATUS.PENDING_ASSIGNMENT_TO_ENGINEER;

export enum BID_EDITABLE_STATUS {
  EDITABLE = 'editable',
  UNEDITABLE = 'uneditable',
}
