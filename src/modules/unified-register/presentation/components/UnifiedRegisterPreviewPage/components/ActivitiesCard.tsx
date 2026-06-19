import { Badge, Text } from '@mantine/core';
import type { IUnifiedRegisterDetail } from '../../../../data/models/UnifiedRegister';
import { SectionCard } from './shared/SectionCard';
import classes from '../UnifiedRegisterPreviewPage.module.css';

type ActivitiesCardProps = {
  item: IUnifiedRegisterDetail;
};

export function ActivitiesCard({ item }: ActivitiesCardProps) {
  return (
    <SectionCard title="Actividades">
      <div className={classes.activitiesList}>
        {item.activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`${classes.activityEntry} ${
              index > 0 ? classes.activityEntryBorder : ''
            }`}
          >
            <div>
              <Text className={classes.activityType}>{activity.type}</Text>
              <Text className={classes.activityLabel}>{activity.label}</Text>
            </div>
            <Badge
              radius="xl"
              classNames={{ label: classes.activityTagLabel }}
              className={
                activity.tagTone === 'blue'
                  ? classes.activityTagPrimary
                  : classes.activityTagSecondary
              }
            >
              {activity.tag}
            </Badge>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
