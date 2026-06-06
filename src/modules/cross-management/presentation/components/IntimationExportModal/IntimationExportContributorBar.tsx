import classes from './IntimationExportModalHeader.module.css'

interface IntimationExportContributorBarProps {
  contributorLabel: string
  cuitLabel: string
}

export function IntimationExportContributorBar({
  contributorLabel,
  cuitLabel
}: IntimationExportContributorBarProps) {
  return (
    <div className={classes.contributorBar}>
      <span className={classes.contributorName}>{contributorLabel}</span>
      <span className={classes.contributorCuit}>{cuitLabel}</span>
    </div>
  )
}
