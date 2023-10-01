class AxiosResponseErrors extends Error {
  constructor(status_Code, errors) {
    super();
    this.status_code = status_Code;
    this.errors = errors;
  }
}


export default AxiosResponseErrors
