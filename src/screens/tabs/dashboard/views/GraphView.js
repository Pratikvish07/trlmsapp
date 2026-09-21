import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/dashboard/TranslatedInputs";
import { pageStyles } from "@/styles/dashboardHomeStyles";
import { useDashboardContext } from "../DashboardContext";

export default function GraphView() {
  const {
    headerCrpInitials,
    headerCrpId,
    headerCrpName,
    selectedPieMeta,
    selectedPieTotal,
    graphType,
    selectedGraphMax,
    closeGraphView
  } = useDashboardContext();

  return (
    <View style={pageStyles.screen}>
      <View style={pageStyles.bgGlowTop} />
      <View style={pageStyles.bgGlowBottom} />
      <View style={pageStyles.frame}>
        <View style={pageStyles.topRow}>
          <View style={pageStyles.imageCard}>
            <Text style={pageStyles.imageAvatarText}>{headerCrpInitials}</Text>
            <Text style={pageStyles.imageText}>CRP</Text>
          </View>
          <View style={pageStyles.infoCard}>
            <Text style={pageStyles.infoLine}>CRP ID: {headerCrpId}</Text>
            <Text style={pageStyles.infoLine}>Name: {headerCrpName}</Text>
          </View>
        </View>

        <View style={pageStyles.graphPageCard}>
          <View style={pageStyles.graphPageHeader}>
            <View>
              <Text style={pageStyles.graphPageEyebrow}>Performance View</Text>
              <Text style={pageStyles.graphPageTitle}>{selectedPieMeta.title}</Text>
            </View>
            <View style={pageStyles.graphTotalBadge}>
              <Text style={pageStyles.graphTotalBadgeLabel}>Total</Text>
              <Text style={pageStyles.graphTotalBadgeValue}>{selectedPieTotal}</Text>
            </View>
          </View>

          <View style={pageStyles.graphSpotlightCard}>
            <Text style={pageStyles.graphSpotlightTitle}>Distribution Overview</Text>
            <View style={pageStyles.graphSpotlightBars}>
              {selectedPieMeta.labels.map((label, index) => {
                const value = Math.max(0, Number(selectedPieMeta.values[index]) || 0);
                const heightPercent = Math.max((value / selectedGraphMax) * 100, value > 0 ? 16 : 8);
                return (
                  <View key={`spotlight-${graphType}-${label}`} style={pageStyles.graphSpotlightBarCol}>
                    <Text style={pageStyles.graphSpotlightValue}>{value}</Text>
                    <View style={pageStyles.graphSpotlightTrack}>
                      <View
                        style={[
                          pageStyles.graphSpotlightFill,
                          {
                            height: `${heightPercent}%`,
                            backgroundColor: selectedPieMeta.colors[index]
                          }
                        ]}
                      />
                    </View>
                    <Text style={pageStyles.graphSpotlightLabel}>{label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={pageStyles.legendWrap}>
            {selectedPieMeta.labels.map((label, index) => {
              const value = Math.max(0, Number(selectedPieMeta.values[index]) || 0);
              const share =
                selectedPieTotal > 0 ? Math.round((value / selectedPieTotal) * 100) : 0;
              return (
                <View key={`${graphType}-${label}`} style={pageStyles.legendCard}>
                  <View style={pageStyles.legendRow}>
                    <View
                      style={[
                        pageStyles.legendDot,
                        { backgroundColor: selectedPieMeta.colors[index] }
                      ]}
                    />
                    <Text style={pageStyles.legendLabel}>{label}</Text>
                    <Text style={pageStyles.legendValue}>
                      {value} ({share}%)
                    </Text>
                  </View>
                  <View style={pageStyles.legendProgressTrack}>
                    <View
                      style={[
                        pageStyles.legendProgressFill,
                        {
                          width: `${share}%`,
                          backgroundColor: selectedPieMeta.colors[index]
                        }
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          <Pressable style={pageStyles.backToDashboardBtn} onPress={closeGraphView}>
            <Text style={pageStyles.backToDashboardText}>Back to Dashboard</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
