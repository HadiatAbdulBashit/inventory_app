import { useForm } from "react-hook-form";

const ResetPasswordForm = ({ resetPassword }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm()

    const onFormSubmit = data => {
        if (data.newPassword === data.confirmNewPassword) {
            resetPassword(data)
            reset()
        } else {
            errors.confirmNewPassword.message = "New password and confirm new password don't march"
        }
    }

    return (
        <form className="row g-3" onSubmit={handleSubmit(onFormSubmit)}>
            <h2>Reset Password</h2>
        <div className={"mb-3"}>
            <label className="form-label">Password</label>
            <input
                {...register('password', { required: `Password is Require` })}
                type="password"
                className={"form-control " + (errors.password && errors.password.message ? 'is-invalid' : null)}
            />
            <div className="invalid-feedback">
                {errors.password && errors.password.message}
            </div>
        </div>
            <div className={"mb-3"}>
                <label className="form-label">New Password</label>
                <input
                    {...register('newPassword', { required: `New Password is Require` })}
                    type="password"
                    className={"form-control " + (errors.newPassword && errors.newPassword.message ? 'is-invalid' : null)}
                />
                <div className="invalid-feedback">
                    {errors.newPassword && errors.newPassword.message}
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                    {...register('confirmNewPassword', { required: 'Confirm New Password is Require', validate: (val) => {
                        if (watch('newPassword') !== val) {
                          return "Your passwords do no match";
                        }
                      }, })}
                    type={'password'}
                    className={"form-control " + (errors.confirmNewPassword && errors.confirmNewPassword.message ? 'is-invalid' : null)}
                />
                <div className="invalid-feedback">
                    {errors.confirmNewPassword && errors.confirmNewPassword.message}
                </div>
            </div>
            <div>
                <button className="btn btn-primary" type="submit">Reset Password</button>
            </div>
        </form>
    )
}

export default ResetPasswordForm