interface IValidationState {
  isPasswordValid: boolean;
  isTagValid: boolean;
}

interface IAction {
    type:
      | "PASSWORD_IS_NOT_VALID"
      | "TAG_IS_NOT_VALID"
      | "PASSWORD_IS_VALID"
      | "TAG_IS_VALID";
  }

export class RegisterLoginValidationService {
  public static readonly initialValidationState: IValidationState = {
    isPasswordValid: true,
    isTagValid: true,
  };

  public static validationReducer = (state: IValidationState, action: IAction) => {
    switch (action.type) {
      case "PASSWORD_IS_VALID":
        return { ...state, isPasswordValid: true };
      case "TAG_IS_VALID":
        return { ...state, isTagValid: true };

      case "PASSWORD_IS_NOT_VALID":
        return { ...state, isPasswordValid: false };
      case "TAG_IS_NOT_VALID":
        return { ...state, isTagValid: false };
      default:
        return state;
    }
  };
}
